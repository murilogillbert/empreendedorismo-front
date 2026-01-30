export interface User {
    id_usuario: number;
    nome_completo: string;
    email: string;
    telefone: string;
    ativo: boolean;
    isGuest?: boolean; // For anonymous access
}

export interface Restaurant {
    id_restaurante: number;
    nome_fantasia: string;
    razao_social?: string;
    cnpj?: string;
    descricao?: string;
    categoria_principal?: string;
    latitude?: number;
    longitude?: number;
    destaque_nivel: 'nenhum' | 'prata' | 'ouro';
}

export interface MenuCategory {
    id_categoria: number;
    id_restaurante: number;
    nome: string;
    icone?: string;
    ordem: number;
    ativo: boolean;
}

export interface MenuItem {
    id_item: number;
    id_restaurante: number;
    id_categoria: number;
    nome: string;
    descricao?: string;
    preco: number;
    ativo: boolean;
    image?: string; // Frontend addition
}

export interface Session {
    id_sessao: number;
    id_restaurante: number;
    id_mesa?: number;
    id_usuario_criador: number;
    status: 'ABERTA' | 'EM_ANDAMENTO' | 'FECHADA' | 'CANCELADA';
    origem: 'MAPA' | 'QRCODE' | 'RESERVA';
}

export interface Order {
    id_pedido: number;
    id_sessao: number;
    id_usuario_cliente?: number;
    status: 'CRIADO' | 'ENVIADO_COZINHA' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
    criado_em: string;
    itens?: OrderItem[];
}

export interface OrderItem {
    id_pedido_item: number;
    id_item: number;
    quantidade: number;
    observacoes?: string;
    valor_unitario: number;
    valor_total: number;
    nome?: string; // Joined field
}

export interface Payment {
    id_pagamento: number;
    id_sessao?: number;
    valor_total: number;
    status: 'PENDENTE' | 'AUTORIZADO' | 'CAPTURADO' | 'CANCELADO' | 'ESTORNADO';
    metodo: 'CARTAO' | 'DINHEIRO' | 'MISTO';
}

export interface Allergen {
    id_alergeno: number;
    nome: string;
    descricao?: string;
}

export interface Ingredient {
    id_ingrediente: number;
    nome: string;
    preco?: number;
    descricao?: string;
}
