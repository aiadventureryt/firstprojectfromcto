import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Planner from '@/pages/Planner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="planner" element={<Planner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
