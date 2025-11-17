import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdmPropt from './pages/AdmPropt';
import AdmHouses from './pages/AdmHouses';
import AdmClient1 from './pages/AdmClient1';
import AdmPayment from './pages/AdmPayment';
import AdmTenant from './pages/AdmTenant';
import AllProperties from './pages/AllProperties';
import States from './pages/States';
import StatesRent from './pages/StatesRent';
import PostProperty from './pages/PostProperty';
import ViewDetail from './pages/ViewDetail';
import Sell from './pages/Sell';
import Rent from './pages/Rent';
import PG from './pages/PG';
import UserProfile from './pages/UserProfile';

import { PropertyProvider } from './contexts/PropertyContext';
import './index.css';

function App() {
  return (
    <PropertyProvider>
      <Router>
        <Routes>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* USER */}
          <Route path="/login" element={<Login />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />

          {/* ADMIN */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AdmPropt" element={<AdmPropt />} />
          <Route path="/AdmHouses" element={<AdmHouses />} />
          <Route path="/AdmClient1" element={<AdmClient1 />} />
          <Route path="/AdmTenant" element={<AdmTenant />} />
          <Route path="/AdmPayment" element={<AdmPayment />} />

          {/* PROPERTIES */}
          <Route path="/allproperties" element={<AllProperties />} />
          <Route path="/states" element={<States />} />
          <Route path="/statesrent" element={<StatesRent />} />
          <Route path="/postproperty" element={<PostProperty />} />
          <Route path="/viewdetail" element={<ViewDetail />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/pg" element={<PG />} />

        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;
