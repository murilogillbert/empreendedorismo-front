import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    Box,
    Grid,
    Button,
    IconButton,
    Badge,
    Fade
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';


const Menu = () => {
    const [cart, setCart] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

        // Fetch menu items from API
        // For now, we'll use restaurant ID 1 (the test restaurant)
        // In the future, this should come from user selection
        fetch('/api/menu/1')
            .then(res => res.json())
            .then(data => {
                // Map database fields to component format
                const formattedItems = data.map(item => ({
                    id: item.id_item,
                    nome: item.nome,
                    preco: parseFloat(item.preco),
                    descricao: item.descricao || '',
                    // Use placeholder image for now
                    imagem: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                }));
                setMenuItems(formattedItems);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching menu:', err);
                setLoading(false);
            });
    }, []);

    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const addToCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            updateCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            updateCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        const existing = cart.find(i => i.id === itemId);
        if (existing.quantity > 1) {
            updateCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            updateCart(cart.filter(i => i.id !== itemId));
        }
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Box>
            <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    O que vamos <span style={{ color: '#FF8C00' }}>comer</span> hoje?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Escolha os melhores pratos do nosso cardápio.
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">Carregando cardápio...</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {menuItems.map((item, index) => {
                        const cartItem = cart.find(i => i.id === item.id);
                        return (
                            <Grid item xs={12} key={item.id}>
                                <Fade in timeout={300 + index * 100}>
                                    <Card sx={{
                                        display: 'flex',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        p: 0,
                                        bgcolor: 'background.paper',
                                        mb: 1
                                    }}>
                                        <Box
                                            component="img"
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                m: 1.5
                                            }}
                                            src={item.imagem}
                                            alt={item.nome}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2, pl: 0.5 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                                                {item.nome}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 1.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    height: 32,
                                                    lineHeight: 1.3
                                                }}
                                            >
                                                {item.descricao}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" color="text.primary" fontWeight="bold">
                                                    R$ {item.preco.toFixed(2)}
                                                </Typography>

                                                {cartItem ? (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        bgcolor: '#F8F8F8',
                                                        borderRadius: 3,
                                                        p: '2px 4px',
                                                        border: '1px solid #F0F0F0'
                                                    }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeFromCart(item.id)}
                                                            sx={{ color: 'text.secondary', p: 0.5 }}
                                                        >
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>
                                                        <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 20, textAlign: 'center' }}>
                                                            {cartItem.quantity}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => addToCart(item)}
                                                            sx={{ bgcolor: 'primary.main', color: 'white', p: 0.5, '&:hover': { bgcolor: 'primary.dark' } }}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => addToCart(item)}
                                                        sx={{
                                                            bgcolor: 'secondary.main',
                                                            color: 'white',
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            '&:hover': { bgcolor: 'primary.main', transform: 'scale(1.1)' },
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </Fade>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default Menu;
