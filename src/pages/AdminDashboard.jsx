import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, Sun, Moon, Home, Users, Building2, User,
  CreditCard, Info, Bell, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jan', rent: 12000, payments: 8 },
  { month: 'Feb', rent: 15000, payments: 10 },
  { month: 'Mar', rent: 18000, payments: 12 },
  { month: 'Apr', rent: 14000, payments: 9 },
  { month: 'May', rent: 17000, payments: 11 },
  { month: 'Jun', rent: 22000, payments: 15 },
  { month: 'Jul', rent: 19000, payments: 13 },
  { month: 'Aug', rent: 45273, payments: 42 },
  { month: 'Sep', rent: 21000, payments: 14 },
  { month: 'Oct', rent: 23000, payments: 16 },
  { month: 'Nov', rent: 20000, payments: 13 },
  { month: 'Dec', rent: 25000, payments: 17 },
];

const HOUSES_STATUS = [
  { name: 'Sold', value: 10 },
  { name: 'Vacant', value: 7 },
  { name: 'Rented', value: 23 },
];

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b'];

function AdminDashboard() {
  const location = useLocation();

  // theme
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rs-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    try { localStorage.setItem('rs-theme', theme); } catch {}
  }, [theme]);

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
    }`}>

      {/* NAVBAR */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">

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
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">New tenant registered</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">Payment received - ₹5,000</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">3 new property requests</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">Logout</Link>
        </div>
      </div>

      <div className="flex">

        {/* SIDEBAR (Copied from AdmHouses) */}
        <aside className={`transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } bg-gray-900 min-h-screen p-4 text-white`}>

          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" />
                <div>
                  <h4 className="font-bold">RoofScout</h4>
                  <p className="text-xs text-gray-300">Property Admin</p>
                </div>
              </div>
            )}

            <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded bg-white/5 hover:bg-white/10">
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info />} text="Info" collapsed={collapsed} active />
            <SidebarItem to="/AdmHouses" icon={<Home />} text="Houses" collapsed={collapsed} />
            <SidebarItem to="/AdmClient1" icon={<Users />} text="Buyer/Seller" collapsed={collapsed} />
            <SidebarItem to="/AdmPropt" icon={<Building2 />} text="Properties" collapsed={collapsed} />
            <SidebarItem to="/AdmTenant" icon={<User />} text="Tenants" collapsed={collapsed} />
            <SidebarItem to="/AdmPayment" icon={<CreditCard />} text="Payment" collapsed={collapsed} />
          </nav>

          <div className="mt-8 text-xs text-gray-300">
            {!collapsed ? (
              <>
                <p className="font-medium">Quick Stats</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <p>Houses Sold: <span className="text-white font-semibold">4</span></p>
                  <p>Vacant: <span className="text-white font-semibold">7</span></p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">RS</div>
            )}
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">Dashboard</h2>
                <div className="text-center">
                  <div className="text-sm opacity-70">Rent Collected</div>
                  <div className="text-lg font-bold">₹45,273</div>
                </div>
              </div>

              {/* CARDS */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                <MiniStat title="Houses Sold" value="4" />
                <MiniStat title="Tenants" value="12" />
                <MiniStat title="Payments" value="34" />
                <MiniStat title="Requests" value="6" />
                <MiniStat title="Rent Collected" value="₹45,273" />
                <MiniStat title="All Balance" value="₹67,354" />
                <MiniStat title="Vacant Houses" value="7" />
              </div>

              {/* CHARTS */}
              <div className="grid lg:grid-cols-3 gap-6 mt-8">

                <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-3">Monthly Rent Collection</h3>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <AreaChart data={MONTHLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="rent" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-3">Houses Status</h3>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={HOUSES_STATUS} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                          {HOUSES_STATUS.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Legend verticalAlign="bottom" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
                  <h3 className="font-semibold mb-3">Monthly Payments</h3>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={MONTHLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="payments" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* TABLE */}
              <div className="mt-8 p-4 rounded-xl shadow bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">New Tenants</h3>
                  <Link to="/AdmTenant" className="text-sm text-blue-500 hover:underline">View All</Link>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="p-3">Name</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">State</th>
                        <th className="p-3">Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b dark:border-gray-700">
                        <td className="p-3">Rohit Sharma</td>
                        <td className="p-3">28-08-2025</td>
                        <td className="p-3 text-green-500 font-semibold">Done</td>
                        <td className="p-3">No</td>
                      </tr>
                      <tr className="border-b dark:border-gray-700">
                        <td className="p-3">Nitish Rana</td>
                        <td className="p-3">28-08-2025</td>
                        <td className="p-3 text-green-500 font-semibold">Done</td>
                        <td className="p-3">No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* Sidebar Item (Copied from AdmHouses) */
function SidebarItem({ to = '#', icon, text, collapsed, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-2 rounded-md text-sm text-gray-100 hover:bg-white/5 transition 
        ${collapsed ? 'justify-center' : ''} 
        ${active ? 'bg-white/5 scale-[1.02]' : ''}`
      }
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5">
        {icon}
      </div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

/* Small Stat Cards */
function MiniStat({ title, value }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold mt-2">{value}</div>
    </div>
  );
}

export default AdminDashboard;
