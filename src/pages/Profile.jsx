import React from 'react';
import { Typography, Box, Avatar, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';

const Profile = () => {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Perfil</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h6">Usuário Teste</Typography>
                <Typography variant="body2" color="text.secondary">teste@teste.com</Typography>
            </Box>

            <Paper elevation={1} sx={{ borderRadius: 3, textAlign: 'left' }}>
                <List>
                    <ListItem button>
                        <ListItemIcon><PaymentIcon /></ListItemIcon>
                        <ListItemText primary="Métodos de Pagamento" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Configurações" />
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default Profile;
