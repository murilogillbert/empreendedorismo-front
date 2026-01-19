import { pgTable, serial, text, doublePrecision, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
    id: serial("id").primaryKey(),
    tradeName: text("trade_name").notNull(),
    description: text("description"),
    allowsPayBefore: boolean("allows_pay_before").default(true),
    allowsPayAfter: boolean("allows_pay_after").default(false),
    reservaMesaPaga: boolean("reserva_mesa_paga").default(true),
    taxaServicoPercentual: integer("taxa_servico_percentual").default(10),
    createdAt: timestamp("created_at").defaultNow(),
});

export const ingredients = pgTable("ingredients", {
    id: serial("id").primaryKey(),
    restaurantId: integer("restaurant_id").references(() => restaurants.id),
    name: text("name").notNull(),
    price: doublePrecision("price").notNull().default(0),
    allergens: jsonb("allergens").default([]), // Array of allergen IDs
    createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
    id: serial("id").primaryKey(),
    restaurantId: integer("restaurant_id").references(() => restaurants.id),
    name: text("name").notNull(),
    description: text("description"),
    price: doublePrecision("price").notNull(),
    category: text("category"),
    isCombo: boolean("is_combo").default(false),
    allergens: jsonb("allergens").default([]),
    createdAt: timestamp("created_at").defaultNow(),
});

export const menuItemIngredients = pgTable("menu_item_ingredients", {
    menuItemId: integer("menu_item_id").references(() => menuItems.id),
    ingredientId: integer("ingredient_id").references(() => ingredients.id),
});

// New table for Combo relationships
export const comboItems = pgTable("combo_items", {
    parentComboId: integer("parent_combo_id").references(() => menuItems.id),
    childItemId: integer("child_item_id").references(() => menuItems.id),
});

export const staff = pgTable("staff", {
    id: serial("id").primaryKey(),
    restaurantId: integer("restaurant_id").references(() => restaurants.id),
    userId: integer("user_id").notNull(),
    role: text("role").notNull(), // GARCOM, COZINHA, BAR, GERENTE
    createdAt: timestamp("created_at").defaultNow(),
});
