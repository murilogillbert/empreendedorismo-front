import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Utensils } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface Restaurant {
    id: number;
    name: string;
    lat: number;
    lng: number;
    category: string;
}

interface RestaurantMapProps {
    restaurants: Restaurant[];
}

// Custom Marker Component to center map on user location
const MapCenterer = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, 15);
    }, [coords, map]);
    return null;
};

// Custom Marker Icon Creator
const createCustomIcon = (color: string) => {
    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex flex-col items-center">
            <div
                style={{ backgroundColor: color }}
                className="flex size-10 items-center justify-center rounded-full text-white shadow-xl ring-4 ring-white"
            >
                <Utensils size={20} />
            </div>
            <div className="h-2 w-0.5 bg-white shadow-sm"></div>
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-div-icon',
        iconSize: [40, 50],
        iconAnchor: [20, 50],
    });
};

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurants }) => {
    const [userCoords, setUserCoords] = useState<[number, number]>([-23.5505, -46.6333]); // Default to São Paulo

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                }
            );
        }
    }, []);

    const primaryIcon = createCustomIcon('#e65c00');
    // const mochaIcon = createCustomIcon('#7A4C30');

    return (
        <div className="absolute inset-0 z-0">
            <MapContainer
                center={userCoords}
                zoom={15}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapCenterer coords={userCoords} />

                {restaurants.map(rest => (
                    <Marker
                        key={rest.id}
                        position={[rest.lat, rest.lng]}
                        icon={primaryIcon}
                    />
                ))}

                <ZoomControl position="topright" />
            </MapContainer>
        </div>
    );
};
