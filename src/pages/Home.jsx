import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    IconButton,
    Fab,
    Chip,
    Button
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom Icons
const createCustomIcon = (color) => new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
         </div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const userIcon = new L.DivIcon({
    html: `<div style="background-color: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(33, 150, 243, 0.5); position: relative;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background-color: #2196F3; animation: pulse 2s infinite;"></div>
         </div>
         <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            70% { transform: scale(2.5); opacity: 0; }
            100% { transform: scale(1); opacity: 0; }
          }
         </style>`,
    className: 'user-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// Load MarkerCluster effectively
if (!L.MarkerClusterGroup) {
    require('leaflet.markercluster');
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [filteredCount, setFilteredCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersLayer = useRef(null);
    const userMarker = useRef(null);

    useEffect(() => {
        // 1. Fetch data
        fetch('/api/restaurants')
            .then(res => res.json())
            .then(data => {
                setRestaurants(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching restaurants:', err);
                setLoading(false);
            });

        // 2. Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                () => setUserLocation([-15.564638, -56.052805])
            );
        } else {
            setUserLocation([-15.564638, -56.052805]);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!userLocation || !mapRef.current || mapInstance.current) return;

        // Initialize Map
        mapInstance.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: true
        }).setView(userLocation, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        // Initial User Marker
        userMarker.current = L.marker(userLocation, { icon: userIcon })
            .addTo(mapInstance.current)
            .bindPopup('Você está aqui');

        // Layer for restaurant markers
        markersLayer.current = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 50
        }).addTo(mapInstance.current);

    }, [userLocation]);

    useEffect(() => {
        if (!mapInstance.current || !restaurants.length || !userLocation) return;

        // Clear previous markers
        markersLayer.current.clearLayers();

        const filtered = restaurants.filter(rest => {
            if (!rest.latitude || !rest.longitude) return false;
            const dist = calculateDistance(
                userLocation[0], userLocation[1],
                parseFloat(rest.latitude), parseFloat(rest.longitude)
            );
            return dist <= 3;
        });

        setFilteredCount(filtered.length);

        filtered.forEach(rest => {
            const marker = L.marker([parseFloat(rest.latitude), parseFloat(rest.longitude)], {
                icon: createCustomIcon('#FF8C00')
            });

            const popupContent = document.createElement('div');
            popupContent.innerHTML = `
        <div style="padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-family: Outfit, sans-serif;">${rest.nome_fantasia}</h4>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;">${rest.categoria_principal || 'Restaurante'}</p>
        </div>
      `;

            const btn = document.createElement('button');
            btn.innerText = 'Ver Cardápio';
            btn.style.cssText = 'width: 100%; background: #FF8C00; color: white; border: none; padding: 8px; border-radius: 8px; font-weight: bold; cursor: pointer;';
            btn.onclick = () => navigate('/menu');

            popupContent.appendChild(btn);

            marker.bindPopup(popupContent);
            markersLayer.current.addLayer(marker);
        });

        // Update user marker position
        if (userMarker.current) {
            userMarker.current.setLatLng(userLocation);
            mapInstance.current.setView(userLocation);
        }

    }, [restaurants, userLocation, navigate]);

    if (loading || !userLocation) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" color="text.secondary">Localizando restaurantes...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, pointerEvents: 'none' }}>
                <Paper elevation={0} sx={{ p: 1, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.05)', pointerEvents: 'auto' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ px: 1 }}>
                        Restaurantes próximos (3km)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, px: 1 }}>
                        <Chip label={`${filteredCount} encontrados`} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                    </Box>
                </Paper>
            </Box>

            {/* Map Container Ref */}
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

            <Fab
                color="primary"
                size="small"
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                            setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                        });
                    }
                }}
            >
                <MyLocationIcon />
            </Fab>
        </Box>
    );
};

export default Home;
