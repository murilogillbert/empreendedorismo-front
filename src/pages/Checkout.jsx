import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Paper,
    IconButton,
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);

    const clearCart = () => {
        localStorage.removeItem('cart');
        setCart([]);
    };

    if (cart.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, p: 3 }}>
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(255, 140, 0, 0.1)',
                        color: 'primary.main',
                        m: '0 auto 24px'
                    }}
                >
                    <ShoppingCartIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Seu carrinho está vazio
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Parece que você ainda não adicionou nenhum item delicioso ao seu carrinho.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/')}>
                    Voltar ao Menu
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => navigate('/')} sx={{ mr: 1, bgcolor: '#f5f5f5' }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">Confira seu pedido</Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 3, border: '1px solid #F0F0F0' }}>
                <List disablePadding>
                    {cart.map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem sx={{ py: 2, px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight="bold" variant="subtitle1">
                                            {item.quantity}x {item.nome}
                                        </Typography>
                                    }
                                    secondary={item.categoria}
                                />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    R$ {(item.preco * item.quantity).toFixed(2)}
                                </Typography>
                            </ListItem>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                        </React.Fragment>
                    ))}

                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography fontWeight="500">R$ {total.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Taxa de serviço (10%)</Typography>
                            <Typography fontWeight="500">R$ {(total * 0.1).toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '2px solid #F0F0F0' }}>
                            <Typography variant="h6" fontWeight="bold">Total</Typography>
                            <Typography variant="h5" fontWeight="900" color="primary.main">
                                R$ {(total * 1.1).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                </List>
            </Paper>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <form action="/create-checkout-session" method="POST">
                    <input type="hidden" name="amount" value={Math.round(total * 1.1 * 100)} />
                    <input type="hidden" name="cartItems" value={JSON.stringify(cart)} />
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        type="submit"
                        sx={{
                            height: 64,
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            borderRadius: 4,
                            boxShadow: '0 8px 24px rgba(255, 140, 0, 0.3)'
                        }}
                    >
                        Pagar Agora
                    </Button>
                </form>

                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<ShareIcon />}
                    onClick={() => {
                        const sessionId = localStorage.getItem('sessionId') || '1';
                        navigate(`/split/${sessionId}`);
                    }}
                    sx={{
                        height: 56,
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: 4,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                    }}
                >
                    Dividir Conta
                </Button>

                <Button
                    fullWidth
                    variant="text"
                    color="inherit"
                    startIcon={<DeleteIcon />}
                    onClick={clearCart}
                    sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                    Limpar Carrinho
                </Button>
            </Box>
        </Box>
    );
};

// Simple icon component if needed, though MUI icons are imported above
const ShoppingCartIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

export default Checkout;
