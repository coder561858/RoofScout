import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Sun, Moon, Users, Home, Building2, User,
  CreditCard, Info, Bell, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_BILLS = [
  { id: 'Bill_5852', from: '19 Nov,2022', to: '19 Dec,2022', amount: 45.0, status: 'Unpaid' },
  { id: 'Bill_3207', from: '19 Dec,2022', to: '19 Jan,2023', amount: 45.0, status: 'Unpaid' },
  { id: 'Bill_5472', from: '19 Jan,2023', to: '19 Feb,2023', amount: 45.0, status: 'Paid' }
];

function AdmPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem('rs-theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('rs-theme', theme);
  }, [theme]);

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem('bills');
      return saved ? JSON.parse(saved) : DEFAULT_BILLS;
    } catch {
      return DEFAULT_BILLS;
    }
  });

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  // FIXED: Navigate to AdminInvoice
  const handleViewBill = (bill) => {
    navigate('/AdmInvoice', { state: { bill } });
  };

  return (
    <div className={`min-h-screen transition ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>

      {/* NAVBAR */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="logo"/>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">Payment Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifs(v => !v)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
              <Bell />
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg border ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="p-3 text-sm">
                    <p className="font-semibold">Notifications</p>
                    <ul className="mt-2 space-y-2">
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">New bill generated</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">3 payments pending</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">1 payment received</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            Logout
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } bg-gray-900 min-h-screen p-4 text-white`}>

          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" alt="logo"/>
                <div>
                  <h4 className="font-bold">RoofScout</h4>
                  <p className="text-xs text-gray-300">Property Admin</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-2 bg-white/5 rounded hover:bg-white/10"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info />} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home />} text="Houses" collapsed={collapsed} />
            <SidebarItem to="/AdmClient1" icon={<Users />} text="Buyer/Seller" collapsed={collapsed} />
            <SidebarItem to="/AdmPropt" icon={<Building2 />} text="Properties" collapsed={collapsed} />
            <SidebarItem to="/AdmTenant" icon={<User />} text="Tenants" collapsed={collapsed} />
            <SidebarItem to="/AdmPayment" icon={<CreditCard />} text="Payment" collapsed={collapsed} active />
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Bill Table</h2>
            <p className="text-sm text-gray-500">Manage bill cycles, payments and history.</p>
          </div>

          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">

              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left">Bill No</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {bills.map(bill => (
                  <motion.tr key={bill.id} whileHover={{ scale: 1.01 }} className="cursor-pointer">
                    <td className="px-4 py-3">{bill.id}</td>
                    <td className="px-4 py-3">{bill.from} → {bill.to}</td>
                    <td className="px-4 py-3 font-semibold">₹{bill.amount.toFixed(2)}</td>
                    <td className={`px-4 py-3 font-semibold ${
                      bill.status === 'Paid' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {bill.status}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                      >
                        <FileText size={16} /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>

            </table>
          </div>

        </main>

      </div>
    </div>
  );
}

function SidebarItem({ to = '#', icon, text, collapsed, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-md text-sm text-gray-100 hover:bg-white/5 transition
        ${collapsed ? 'justify-center' : ''}
        ${active ? 'bg-white/5 scale-[1.02]' : ''}`}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5">
        {icon}
      </div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

export default AdmPayment;
