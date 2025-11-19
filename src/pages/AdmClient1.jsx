import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, Sun, Moon, Users, Home, Building2, User,
  CreditCard, Info, Bell, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_CLIENTS = [
  { id: 1, name: "Admin", email: "Admin@gmail.com", photo: "https://i.pravatar.cc/150?img=1", phone: "8978675689", location: "Nashik, Dindori", gender: "Male", type: "Admin", dob: "2000-05-13" },
  { id: 2, name: "Raman Desai", email: "raman@gmail.com", photo: "https://i.pravatar.cc/150?img=2", phone: "6789675678", location: "Nashik, Dindori", gender: "Male", type: "Agent", dob: "1999-11-21" },
  { id: 3, name: "Suhas Pande", email: "suhas@gmail.com", photo: "https://i.pravatar.cc/150?img=3", phone: "7869678967", location: "Nashik, Dindori", gender: "Male", type: "Student", dob: "2002-08-10" },
  { id: 4, name: "Swati Misra", email: "swati@gmail.com", photo: "https://i.pravatar.cc/150?img=4", phone: "8465757575", location: "Pune, Goreg", gender: "Female", type: "Tenant", dob: "2001-03-02" },
  { id: 5, name: "Rohit Sharma", email: "Rohit@gmail.com", photo: "https://i.pravatar.cc/150?img=5", phone: "7789855757", location: "Nashik, Niphad", gender: "Male", type: "Student", dob: "2002-11-13" }
];

function AdmClient1() {
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

  const [clients] = useState(INITIAL_CLIENTS);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(INITIAL_CLIENTS);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(clients);

    const f = clients.filter(c =>
      String(c.id).includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.location || '').toLowerCase().includes(q)
    );
    setFiltered(f);
  }, [search, clients]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
    }`}>

      {/* NAVBAR */}
      <div className={`backdrop-blur-md ${
        theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/60'
      } sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"
          >
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
              <p className="text-sm opacity-70">Client Library</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="relative">
            <button onClick={() => setShowNotifs(v => !v)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">
              <Bell/>
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
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">New tenant added</li>
                      <li className="p-2 rounded hover:bg-gray-100/40 dark:hover:bg-gray-700/40">Payment received</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">Logout</Link>
        </div>
      </div>

      <div className="flex">

        {/* SIDEBAR (Copied EXACTLY from AdmHouses) */}
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

            <button
              onClick={() => setCollapsed(c => !c)}
              className="p-2 rounded bg-white/5 hover:bg-white/10"
            >
              {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info/>} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home/>} text="Houses" collapsed={collapsed} />
            <SidebarItem to="/AdmClient1" icon={<Users/>} text="Buyer/Seller" collapsed={collapsed} active />
            <SidebarItem to="/AdmPropt" icon={<Building2/>} text="Properties" collapsed={collapsed} />
            <SidebarItem to="/AdmTenant" icon={<User/>} text="Tenants" collapsed={collapsed} />
            <SidebarItem to="/AdmPayment" icon={<CreditCard/>} text="Payment" collapsed={collapsed} />
          </nav>

          <div className="mt-8 text-xs text-gray-300">
            {!collapsed ? (
              <>
                <p className="font-medium">Quick Stats</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <p>Clients: <span className="font-semibold text-white">{clients.length}</span></p>
                  <p>Vacant Houses: <span className="font-semibold text-white">7</span></p>
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
                <h2 className="text-2xl font-extrabold">All Clients</h2>

                <input
                  placeholder="Search by name, email, phone or location"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded w-80 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* TABLE */}
                <div className="lg:col-span-2 p-4 rounded-xl shadow bg-white dark:bg-gray-800">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Photo</th>
                        <th className="p-3 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">

                      {filtered.length ? filtered.map(c => (
                        <tr key={c.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setSelected(c)}>
                          <td className="p-3">{c.id}</td>
                          <td className="p-3">{c.name}</td>
                          <td className="p-3">
                            <img src={c.photo} className="h-10 w-10 rounded-full object-cover" />
                          </td>
                          <td className="p-3">{c.email}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center py-6 text-gray-500">No clients found</td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>

                {/* DETAILS */}
                <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">

                  {selected ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex gap-4">
                        <img src={selected.photo} className="h-28 w-28 rounded-lg object-cover shadow" />
                        <div>
                          <h3 className="text-xl font-bold">{selected.name}</h3>
                          <p className="text-blue-500 text-sm">{selected.location}</p>
                          <p className="text-sm text-gray-500">Gender: {selected.gender}</p>
                          <p className="text-sm text-gray-500">Type: {selected.type}</p>
                        </div>
                      </div>

                      <p><strong>Phone:</strong> {selected.phone}</p>
                      <p><strong>Email:</strong> {selected.email}</p>

                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-red-500 text-white rounded">Cancel Agreement</button>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded">Show Owner</button>
                        <button className="px-3 py-2 bg-gray-600 text-white rounded">Is Check</button>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-center text-gray-500">Select a client to view details</p>
                  )}

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

export default AdmClient1;
