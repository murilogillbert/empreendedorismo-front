import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    Button,
    TextField,
    Slider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Chip,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const SplitBill = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentPercentage, setPaymentPercentage] = useState(50);
    const [payerName, setPayerName] = useState('');
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [processing, setProcessing] = useState(false);

    // Get total from localStorage cart
    const getCartTotal = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    };

    const fetchPaymentStatus = async () => {
        try {
            const total = getCartTotal();
            const response = await fetch(`/api/session/${sessionId}/payment-status?total=${total}`);

            if (!response.ok) {
                console.error('Failed to fetch payment status:', response.status);
                setLoading(false);
                return;
            }

            const data = await response.json();
            setPaymentData(data);

            // Set initial payment amount to remaining amount
            if (data.remainingAmount > 0) {
                setPaymentAmount(data.remainingAmount);
                setPaymentPercentage(100);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching payment status:', error);
            setLoading(false);
        }
    };

    const fetchShareLink = async () => {
        try {
            const response = await fetch(`/api/session/${sessionId}/share-link`);
            const data = await response.json();
            setShareLink(data.shareUrl);
        } catch (error) {
            console.error('Error fetching share link:', error);
        }
    };

    useEffect(() => {
        fetchPaymentStatus();
        fetchShareLink();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchPaymentStatus, 5000);
        return () => clearInterval(interval);
    }, [sessionId]);

    useEffect(() => {
        // Check for success/cancel params
        if (searchParams.get('success') === 'true') {
            // Clear cart from localStorage on success
            localStorage.removeItem('cart');

            setTimeout(() => {
                fetchPaymentStatus();
            }, 2000);
        }
    }, [searchParams]);

    const handlePercentageChange = (event, newValue) => {
        setPaymentPercentage(newValue);
        if (paymentData) {
            const amount = (paymentData.remainingAmount * newValue) / 100;
            setPaymentAmount(parseFloat(amount.toFixed(2)));
        }
    };

    const handleAmountChange = (event) => {
        const value = parseFloat(event.target.value) || 0;
        setPaymentAmount(value);
        if (paymentData && paymentData.remainingAmount > 0) {
            const percentage = (value / paymentData.remainingAmount) * 100;
            setPaymentPercentage(Math.min(100, Math.max(0, percentage)));
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePayment = async () => {
        if (paymentAmount <= 0) {
            alert('Por favor, insira um valor válido');
            return;
        }

        if (!payerName.trim()) {
            alert('Por favor, insira seu nome');
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch(`/api/session/${sessionId}/create-split-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: paymentAmount,
                    payerName: payerName.trim()
                })
            });

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Erro ao criar pagamento');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" color="text.secondary">Carregando informações...</Typography>
            </Box>
        );
    }

    if (!paymentData) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Sessão não encontrada</Alert>
            </Box>
        );
    }

    const { totalAmount, paidAmount, remainingAmount, isComplete, divisions } = paymentData;

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dividir <span style={{ color: '#FF8C00' }}>Conta</span>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sessão #{sessionId}
            </Typography>

            {searchParams.get('success') === 'true' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Pagamento realizado com sucesso! ✅
                </Alert>
            )}

            {searchParams.get('canceled') === 'true' && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Pagamento cancelado
                </Alert>
            )}

            {/* Total Amount Card */}
            <Card sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Valor Total</Typography>
                <Typography variant="h3" fontWeight="bold">
                    R$ {totalAmount.toFixed(2)}
                </Typography>
            </Card>

            {/* Remaining Amount */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Falta Pagar</Typography>
                        <Typography variant="h4" fontWeight="bold" color={isComplete ? 'success.main' : 'text.primary'}>
                            R$ {remainingAmount.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2" color="text.secondary">Já Pago</Typography>
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                            R$ {paidAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>

                {isComplete && (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                        Conta totalmente paga! 🎉
                    </Alert>
                )}
            </Card>

            {/* Share Link */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Compartilhar Link
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={shareLink}
                        InputProps={{ readOnly: true }}
                        sx={{ bgcolor: 'background.default' }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleCopyLink}
                        sx={{ bgcolor: copied ? 'success.main' : 'primary.main', color: 'white', '&:hover': { bgcolor: copied ? 'success.dark' : 'primary.dark' } }}
                    >
                        {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                    </IconButton>
                </Box>
                {copied && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                        Link copiado!
                    </Typography>
                )}
            </Card>

            {/* Payment Form */}
            {!isComplete && (
                <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Quanto você vai pagar?
                    </Typography>

                    <TextField
                        fullWidth
                        label="Seu Nome"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        sx={{ mb: 3 }}
                        placeholder="Digite seu nome"
                    />

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Porcentagem: {paymentPercentage.toFixed(0)}%
                        </Typography>
                        <Slider
                            value={paymentPercentage}
                            onChange={handlePercentageChange}
                            min={0}
                            max={100}
                            step={1}
                            marks={[
                                { value: 0, label: '0%' },
                                { value: 25, label: '25%' },
                                { value: 50, label: '50%' },
                                { value: 75, label: '75%' },
                                { value: 100, label: '100%' }
                            ]}
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="Valor a Pagar"
                        type="number"
                        value={paymentAmount}
                        onChange={handleAmountChange}
                        InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                        }}
                        inputProps={{
                            step: 0.01,
                            min: 0,
                            max: remainingAmount
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handlePayment}
                        disabled={processing || paymentAmount <= 0 || !payerName.trim()}
                        sx={{ height: 56, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        {processing ? <CircularProgress size={24} color="inherit" /> : `Pagar R$ ${paymentAmount.toFixed(2)}`}
                    </Button>
                </Card>
            )}

            {/* Payment History */}
            {divisions.length > 0 && (
                <Card sx={{ p: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Histórico de Pagamentos
                    </Typography>
                    <List>
                        {divisions.map((division, index) => (
                            <React.Fragment key={division.id}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={division.payerName}
                                        secondary={new Date(division.createdAt).toLocaleString('pt-BR')}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            R$ {division.amount.toFixed(2)}
                                        </Typography>
                                        <Chip
                                            label={division.status === 'PAGO' ? 'Pago' : 'Em processamento'}
                                            color={division.status === 'PAGO' ? 'success' : 'info'}
                                            size="small"
                                            icon={division.status === 'PAGO' ? <CheckCircleIcon /> : <PendingIcon />}
                                        />
                                    </Box>
                                </ListItem>
                                {index < divisions.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Card>
            )}
        </Box>
    );
};

export default SplitBill;
