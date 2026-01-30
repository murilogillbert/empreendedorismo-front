import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/pages/manager/Dashboard';
import { MenuManagement } from '@/pages/manager/MenuManagement';
import { StaffManagement } from '@/pages/manager/StaffManagement';
import { Settings } from '@/pages/manager/Settings';
import { Analytics } from '@/pages/manager/Analytics';
import { AddMenuItem } from '@/pages/manager/AddMenuItem';
import { EmployeeAccess } from '@/pages/manager/EmployeeAccess';
import { CategoryManagement } from '@/pages/manager/CategoryManagement';
import { HelpCenter } from '@/pages/manager/HelpCenter';
import { EditMenuItem } from '@/pages/manager/EditMenuItem';
import { IngredientsInventory } from '@/pages/manager/IngredientsInventory';
import { KitchenLogin } from '@/pages/manager/KitchenLogin';
import { KitchenProduction } from '@/pages/manager/KitchenProduction';
import { Discovery } from '@/pages/consumer/Discovery';
import { Auth } from '@/pages/consumer/Auth';
import { RestaurantMenu } from '@/pages/consumer/RestaurantMenu';
import { ActiveSession } from '@/pages/consumer/ActiveSession';
import { Reservations } from '@/pages/consumer/Reservations';
import { Cart } from '@/pages/consumer/Cart';
import { Orders } from '@/pages/consumer/Orders';
import { Bill } from '@/pages/consumer/Bill';
import { SplitBill } from '@/pages/consumer/SplitBill';
import { Profile } from '@/pages/consumer/Profile';
import { Saved } from '@/pages/consumer/Saved';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Discovery />} />
        <Route path="/explore" element={<Discovery />} />
        <Route path="/manager" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/menu/:id" element={<RestaurantMenu />} />
        <Route path="/menu" element={<Navigate to="/menu/1" replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/split-bill" element={<SplitBill />} />
        <Route path="/sessions" element={<ActiveSession />} />
        <Route path="/reservations/:id" element={<Reservations />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />

        {/* Manager Routes */}
        <Route path="/manager/menu" element={<MenuManagement />} />
        <Route path="/manager/staff" element={<StaffManagement />} />
        <Route path="/manager/settings" element={<Settings />} />
        <Route path="/manager/analytics" element={<Analytics />} />
        <Route path="/manager/menu/add" element={<AddMenuItem />} />
        <Route path="/manager/menu/edit/:id" element={<EditMenuItem />} />
        <Route path="/manager/menu/categories" element={<CategoryManagement />} />
        <Route path="/manager/menu/ingredients" element={<IngredientsInventory />} />
        <Route path="/manager/staff/:id" element={<EmployeeAccess />} />

        <Route path="/help" element={<HelpCenter />} />
        <Route path="/kitchen-login" element={<KitchenLogin />} />
        <Route path="/kitchen-production" element={<KitchenProduction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
