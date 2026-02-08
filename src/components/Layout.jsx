import React from 'react';
import {
    Outlet,
    useNavigate,
    useLocation
} from 'react-router-dom';
import {
    Box,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Container,
    Typography,
    AppBar,
    Toolbar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const getValue = () => {
        if (location.pathname === '/') return 0;
        if (location.pathname === '/menu') return 1;
        if (location.pathname === '/orders') return 2;
        if (location.pathname === '/checkout') return 3;
        if (location.pathname === '/profile') return 4;
        return 0;
    };

    return (
        <Box sx={{
            pb: isHome ? 0 : 10,
            minHeight: '100vh',
            bgcolor: 'background.default',
            transition: 'background-color 0.3s ease'
        }}>
            {!isHome && (
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(252, 252, 252, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid #F0F0F0',
                        color: 'text.primary'
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'center' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                            UTABLE
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {isHome ? (
                <Outlet />
            ) : (
                <Container maxWidth="sm" sx={{ pt: 3, pb: 4 }}>
                    <Outlet />
                </Container>
            )}

            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 10,
                    right: 10,
                    zIndex: 1000,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }}
                elevation={0}
            >
                <BottomNavigation
                    showLabels
                    value={getValue()}
                    onChange={(event, newValue) => {
                        if (newValue === 0) navigate('/');
                        if (newValue === 1) navigate('/menu');
                        if (newValue === 2) navigate('/orders');
                        if (newValue === 3) navigate('/checkout');
                        if (newValue === 4) navigate('/profile');
                    }}
                    sx={{
                        height: 72,
                        bgcolor: 'transparent',
                        '& .MuiBottomNavigationAction-root': {
                            minWidth: 'auto',
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main',
                                '& .MuiSvgIcon-root': {
                                    transform: 'scale(1.2)',
                                    transition: 'transform 0.2s ease'
                                }
                            }
                        }
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Menu" icon={<RestaurantMenuIcon />} />
                    <BottomNavigationAction label="Pedidos" icon={<ReceiptLongIcon />} />
                    <BottomNavigationAction label="Carrinho" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default Layout;
