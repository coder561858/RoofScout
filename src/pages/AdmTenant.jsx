import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, Sun, Moon, Users, Home, Building2, User,
  CreditCard, Info, Bell, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_TENANTS = [
  { id: 1, name: "Swati Misra", email: "swati@gmail.com", house: "566 Pound Apartment, Nashik", phone: "8465757575", status: "Done", checked: true, photo: "https://i.pravatar.cc/150?img=4", rentDuration: "12 Months", startDate: "2024-05-10" },
  { id: 2, name: "Rohit Sharma", email: "rohit@gmail.com", house: "324 Tara Place, Pune", phone: "7789855757", status: "Done", checked: true, photo: "https://i.pravatar.cc/150?img=5", rentDuration: "6 Months", startDate: "2024-09-01" },
  { id: 3, name: "Nitish Rana", email: "nitish@gmail.com", house: "34 Azad Nagar, Rajura, Punjab", phone: "7789855757", status: "Dismiss", checked: false, photo: "https://i.pravatar.cc/150?img=2", rentDuration: "3 Months", startDate: "2024-05-28" },
  { id: 4, name: "Suhas Pande", email: "suhas@gmail.com", house: "Ganga Sagar House 388, Nashik", phone: "7869678967", status: "Done", checked: true, photo: "https://i.pravatar.cc/150?img=3", rentDuration: "9 Months", startDate: "2024-03-15" }
];

function AdmTenant() {
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rs-theme') || 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark'
      ? root.classList.add('dark')
      : root.classList.remove('dark');

    try { localStorage.setItem('rs-theme', theme); } catch {}
  }, [theme]);

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const [tenants] = useState(INITIAL_TENANTS);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(INITIAL_TENANTS);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(tenants);

    const f = tenants.filter(t =>
      String(t.id).includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      (t.phone || '').includes(q) ||
      (t.house || '').toLowerCase().includes(q)
    );
    setFiltered(f);
  }, [search, tenants]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition`}>

      {/* NAVBAR */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            <Menu size={20}/>
          </button>

          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
              </h1>
              <p className="text-sm opacity-70">Tenant Management</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifs(s => !s)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
              <Bell/>
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`absolute right-0 mt-2 w-72 shadow-lg border rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="p-3 text-sm">
                    <p className="font-semibold">Notifications</p>
                    <ul className="mt-2 space-y-2">
                      <li className="hover:bg-gray-100/40 dark:hover:bg-gray-700/40 p-2 rounded">Tenant rent overdue</li>
                      <li className="hover:bg-gray-100/40 dark:hover:bg-gray-700/40 p-2 rounded">New tenant request</li>
                      <li className="hover:bg-gray-100/40 dark:hover:bg-gray-700/40 p-2 rounded">4 agreements pending</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* THEME TOGGLE */}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
            Logout
          </Link>
        </div>

      </div>

      <div className="flex">

        {/* SIDEBAR (EXACT AdmHouses Sidebar) */}
        <aside className={`transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } bg-gray-900 text-white min-h-screen p-4`}>

          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" />
                <div>
                  <h4 className="font-bold">RoofScout</h4>
                  <p className="text-xs text-gray-400">Property Admin</p>
                </div>
              </div>
            )}

            <button onClick={() => setCollapsed(c => !c)} className="p-2 bg-white/5 rounded hover:bg-white/10">
              {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
            </button>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info/>} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home/>} text="Houses" collapsed={collapsed} />
            <SidebarItem to="/AdmClient1" icon={<Users/>} text="Buyer/Seller" collapsed={collapsed} />
            <SidebarItem to="/AdmPropt" icon={<Building2/>} text="Properties" collapsed={collapsed} />
            <SidebarItem to="/AdmTenant" icon={<User/>} text="Tenants" collapsed={collapsed} active />
            <SidebarItem to="/AdmPayment" icon={<CreditCard/>} text="Payment" collapsed={collapsed} />
          </nav>

          {/* QUICK STATS */}
          <div className="mt-8 text-xs text-gray-300">
            {!collapsed ? (
              <>
                <p className="font-medium">Quick Stats</p>
                <div className="mt-2 space-y-1">
                  <p>Tenants: <span className="text-white font-semibold">{tenants.length}</span></p>
                  <p>Active: <span className="text-white font-semibold">{tenants.filter(t => t.status === 'Done').length}</span></p>
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

              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold">All Tenants</h2>

                <input
                  placeholder="Search by name, email, phone or house"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded w-80 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* TABLE */}
                <div className="lg:col-span-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">House</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y dark:divide-gray-700">
                      {filtered.length ? filtered.map(t => (
                        <tr key={t.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => setSelected(t)}
                        >
                          <td className="p-3">{t.id}</td>
                          <td className="p-3">{t.name}</td>
                          <td className="p-3">{t.email}</td>
                          <td className="p-3">{t.house}</td>
                          <td className={`p-3 font-semibold ${
                            t.status === "Done" ? "text-green-500" : "text-red-500"
                          }`}>{t.status}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-center py-6 text-gray-500">No tenants found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* DETAILS */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                  <AnimatePresence>
                    {selected ? (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="space-y-4"
                      >
                        <div className="flex gap-4">
                          <img src={selected.photo} className="h-28 w-28 rounded-lg object-cover shadow" />
                          <div>
                            <h3 className="text-xl font-bold">{selected.name}</h3>
                            <p className="text-blue-500">{selected.house}</p>
                            <p className="text-sm text-gray-500">Start Date: {selected.startDate}</p>
                            <p className="text-sm text-gray-500">Rent Duration: {selected.rentDuration}</p>
                            <p className="text-sm text-gray-500">Admin Check: {selected.checked ? "Verified" : "Pending"}</p>
                          </div>
                        </div>

                        <p><strong>Phone:</strong> {selected.phone}</p>
                        <p><strong>Email:</strong> {selected.email}</p>

                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-red-500 text-white rounded">Cancel Rent</button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded">Contact</button>
                          <button className="px-4 py-2 bg-gray-600 text-white rounded">More</button>
                        </div>

                      </motion.div>
                    ) : (
                      <p className="text-center text-gray-500">Select a tenant to view details</p>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* SidebarItem copied 100% from AdmHouses */
function SidebarItem({ to='#', icon, text, collapsed, active }) {
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

export default AdmTenant;
