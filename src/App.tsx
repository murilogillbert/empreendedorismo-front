import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/manager/Dashboard';
import { MenuManagement } from '@/pages/manager/MenuManagement';
import { StaffManagement } from '@/pages/manager/StaffManagement';
import { Settings } from '@/pages/manager/Settings';
import { Analytics } from '@/pages/manager/Analytics';
import { AddMenuItem } from '@/pages/manager/AddMenuItem';
import { EmployeeAccess } from '@/pages/manager/EmployeeAccess';
import { AdvancedSettings } from '@/pages/manager/AdvancedSettings';
import { CategoryManagement } from '@/pages/manager/CategoryManagement';
import { HelpCenter } from '@/pages/manager/HelpCenter';
import { EditMenuItem } from '@/pages/manager/EditMenuItem';
import { IngredientsInventory } from '@/pages/manager/IngredientsInventory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/advanced" element={<AdvancedSettings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/menu/add" element={<AddMenuItem />} />
        <Route path="/menu/edit/:id" element={<EditMenuItem />} />
        <Route path="/menu/categories" element={<CategoryManagement />} />
        <Route path="/menu/ingredients" element={<IngredientsInventory />} />
        <Route path="/staff/:id" element={<EmployeeAccess />} />
        <Route path="/help" element={<HelpCenter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
