import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button,
    IconButton,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [sessionId, setSessionId] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    // Get or create session
    const initializeSession = async () => {
        try {
            // Check if session exists in localStorage
            const storedSessionId = localStorage.getItem('sessionId');

            if (storedSessionId) {
                setSessionId(storedSessionId);
                fetchSessionData(storedSessionId);
            } else {
                // Create new session
                const response = await fetch('/api/session/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ restaurantId: 1 })
                });

                const data = await response.json();
                const newSessionId = data.sessionId;

                // Save to localStorage
                localStorage.setItem('sessionId', newSessionId);
                setSessionId(newSessionId);
                fetchSessionData(newSessionId);
            }
        } catch (error) {
            console.error('Error initializing session:', error);
            setLoading(false);
        }
    };

    // Fetch session data including payment status
    const fetchSessionData = async (sid) => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const total = cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0) * 1.1; // Include 10% service fee

            // Fetch payment status
            const response = await fetch(`/api/session/${sid}/payment-status?total=${total}`);

            if (response.ok) {
                const data = await response.json();
                setSessionData(data);

                // Fetch share link
                const linkResponse = await fetch(`/api/session/${sid}/share-link`);
                if (linkResponse.ok) {
                    const linkData = await linkResponse.json();
                    setShareLink(linkData.shareUrl);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching session data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeSession();

        // Poll every 10 seconds
        const interval = setInterval(() => {
            const sid = localStorage.getItem('sessionId');
            if (sid) {
                fetchSessionData(sid);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGoToSplit = () => {
        if (sessionId) {
            navigate(`/split/${sessionId}`);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" color="text.secondary">Carregando pedido...</Typography>
            </Box>
        );
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const hasItems = cart.length > 0;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Meus <span style={{ color: '#FF8C00' }}>Pedidos</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Acompanhe seu pedido e pagamento em tempo real.
            </Typography>

            {sessionId && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Sessão ativa: #{sessionId}
                </Alert>
            )}

            {/* Order Items */}
            {sessionData && sessionData.items && sessionData.items.length > 0 ? (
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Itens do Pedido
                    </Typography>
                    <List>
                        {sessionData.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={`${item.quantity}x ${item.name}`}
                                        secondary={`R$ ${parseFloat(item.price).toFixed(2)} cada`}
                                    />
                                    <Typography variant="h6" fontWeight="bold">
                                        R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                                {index < sessionData.items.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h5" fontWeight="900" color="primary.main">
                            R$ {sessionData.totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Paper>
            ) : hasItems ? (
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Itens do Carrinho (Não confirmados)
                    </Typography>
                    <List>
                        {cart.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={`${item.quantity}x ${item.nome}`}
                                        secondary={`R$ ${item.preco.toFixed(2)} cada`}
                                    />
                                    <Typography variant="h6" fontWeight="bold">
                                        R$ {(item.preco * item.quantity).toFixed(2)}
                                    </Typography>
                                </ListItem>
                                {index < cart.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight="500">
                            R$ {cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography color="text.secondary">Taxa de serviço (10%)</Typography>
                        <Typography fontWeight="500">
                            R$ {(cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0) * 0.1).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '2px solid #F0F0F0' }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h5" fontWeight="900" color="primary.main">
                            R$ {(cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0) * 1.1).toFixed(2)}
                        </Typography>
                    </Box>
                </Paper>
            ) : null}

            {/* Payment Status */}
            {sessionData && hasItems && (
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Status do Pagamento
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                            <Typography variant="h5" fontWeight="bold">
                                R$ {sessionData.totalAmount.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">Já Pago</Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                R$ {sessionData.paidAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Falta Pagar</Typography>
                        <Typography variant="h4" fontWeight="bold" color={sessionData.isComplete ? 'success.main' : 'warning.main'}>
                            R$ {sessionData.remainingAmount.toFixed(2)}
                        </Typography>
                    </Box>

                    {sessionData.isComplete && (
                        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
                            Pagamento completo! 🎉
                        </Alert>
                    )}

                    {/* Payment Divisions */}
                    {sessionData.divisions && sessionData.divisions.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Divisões de Pagamento
                            </Typography>
                            <List dense>
                                {sessionData.divisions.map((division) => (
                                    <ListItem key={division.id} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={division.payerName}
                                            secondary={new Date(division.createdAt).toLocaleString('pt-BR')}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                R$ {division.amount.toFixed(2)}
                                            </Typography>
                                            <Chip
                                                label={division.status === 'PAGO' ? 'Pago' : 'Pendente'}
                                                color={division.status === 'PAGO' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </Paper>
            )}

            {/* Share Link */}
            {shareLink && hasItems && (
                <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Compartilhar Conta
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Compartilhe este link para dividir a conta com amigos
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleCopyLink}
                            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                            color={copied ? 'success' : 'primary'}
                        >
                            {copied ? 'Link Copiado!' : 'Copiar Link'}
                        </Button>
                        <IconButton
                            color="primary"
                            onClick={handleGoToSplit}
                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}

            {!hasItems && (
                <Paper elevation={1} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Nenhum pedido ativo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Adicione itens ao carrinho para começar um pedido
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/menu')}>
                        Ver Cardápio
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default Orders;
