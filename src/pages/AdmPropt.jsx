// src/pages/AdmPropt.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PropertyContext } from '../contexts/PropertyContext';
import { Menu, Sun, Moon, Home, Users, Building2, User, CreditCard, Info, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdmPropt() {
  const navigate = useNavigate();
  const location = useLocation();

  const { getCombinedProperties, hideProperty, loading, updateProperty } = useContext(PropertyContext);

  const [mode, setMode] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 3;
  const [search, setSearch] = useState('');

  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('rs-theme') || 'light');
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('rs-theme', theme);
  }, [theme]);

  const allCombined = useMemo(() => getCombinedProperties({ mode }), [getCombinedProperties, mode]);
  const plotsOnly = useMemo(() => allCombined.filter(p => String(p.type || '').toLowerCase() === 'plot'), [allCombined]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plotsOnly;
    return plotsOnly.filter(p => {
      return (
        String(p.id || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q) ||
        (p.state || '').toLowerCase().includes(q) ||
        (p.district || '').toLowerCase().includes(q)
      );
    });
  }, [plotsOnly, search]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);
  const paginated = filtered.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const handleViewDetails = (property) => {
    const params = new URLSearchParams({
      houseId: property.id || '',
      title: property.title || '',
      desc: property.description || '',
      address: property.address || '',
      priceText: property.priceText || '',
      image: property.image || '',
      owner: property.owner || '',
      location: property.state || property.district || '',
      type: property.type || '',
      area: property.area || '',
      beds: property.beds ? String(property.beds) : '',
      baths: property.baths ? String(property.baths) : '',
      garages: property.garages ? String(property.garages) : ''
    });
    navigate(`/ViewDetail?${params.toString()}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Hide property ${id}? This will remove it from public listings.`)) hideProperty(id);
  };

  const handleSaveFromCard = (updated) => {
    updateProperty(updated.id, updated);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme==='dark'?'bg-gray-900 text-gray-100':'bg-gray-100 text-gray-900'}`}>

      {/* NAV */}
      <div className={`backdrop-blur-md ${theme==='dark'?'bg-gray-800/70':'bg-white/60'} sticky top-0 z-50 flex justify-between items-center h-20 px-6 shadow-sm`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"><Menu size={20}/></button>
          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full" alt="RoofScout" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/">
                  <span className="text-yellow-400">Roof</span>
                  <span className="text-blue-500">Scout</span>
                </Link>
                </h1>
              <p className="text-sm opacity-70">Property Listings</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNotifs(v => !v)} className="p-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20"><Bell/></button>
          </div>

          <button onClick={() => setTheme(t => t==='dark'?'light':'dark')} className="px-3 py-2 border rounded hover:shadow">
            {theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}
          </button>

          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-200/20 dark:hover:bg-gray-700/20">Logout</Link>
        </div>
      </div>

      <div className="flex">
        <aside className={`transition-all duration-300 ${collapsed?'w-20':'w-72'} bg-gray-900 min-h-screen p-4 text-white`}> 
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img src="/logoRS.jpg" className="h-10 w-10 rounded-full" alt="logo" />
                <div>
                  <h4 className="font-bold">RoofScout</h4>
                  <p className="text-xs text-gray-300">Property Admin</p>
                </div>
              </div>
            )}
            <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded bg-white/5 hover:bg-white/10">{collapsed?<ChevronRight size={18}/>:<ChevronLeft size={18}/>}</button>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem to="/AdminDashboard" icon={<Info/>} text="Info" collapsed={collapsed} />
            <SidebarItem to="/AdmHouses" icon={<Home/>} text="Houses" collapsed={collapsed} />
            <SidebarItem to="/AdmClient1" icon={<Users/>} text="Buyer/Seller" collapsed={collapsed} />
            <SidebarItem to="/AdmPropt" icon={<Building2/>} text="Properties" collapsed={collapsed} active />
            <SidebarItem to="/AdmTenant" icon={<User/>} text="Tenants" collapsed={collapsed} />
            <SidebarItem to="/AdmPayment" icon={<CreditCard/>} text="Payment" collapsed={collapsed} />
          </nav>

          <div className="mt-8 text-xs text-gray-300">
            {!collapsed ? (
              <>
                <p className="font-medium">Quick Stats</p>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <p>Plots: <span className="font-semibold text-white">{plotsOnly.length}</span></p>
                  <p>Visible: <span className="font-semibold text-white">{filtered.length}</span></p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">RS</div>
            )}
          </div>
        </aside>

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname+mode+page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.35}}>
              <header className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Available Plots</h1>
                  <p className="text-gray-500 dark:text-gray-300 mt-1">Browse and manage plot listings.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/postproperty')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">List Property</button>

                  <div className="hidden sm:flex items-center rounded bg-gray-200 dark:bg-gray-700 p-1">
                    <button onClick={() => { setMode('all'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='all'?'bg-white shadow text-black':'bg-transparent'}`}>All</button>
                    <button onClick={() => { setMode('buy'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='buy'?'bg-white shadow text-black':'bg-transparent'}`}>Buy</button>
                    <button onClick={() => { setMode('rent'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='rent'?'bg-white shadow text-black':'bg-transparent'}`}>Rent</button>
                    <button onClick={() => { setMode('admin'); setPage(1); }} className={`px-3 py-2 rounded ${mode==='admin'?'bg-white shadow text-black':'bg-transparent'}`}>Admin</button>
                  </div>

                  <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search by id, title, address or state" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 rounded-md text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </header>

              {loading ? (
                <div className="text-center py-16 text-gray-500">Loading properties...</div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No plots to display.</div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map(prop => (
                    <motion.div key={prop.id} whileHover={{ scale: 1.02 }} className="h-full flex flex-col">
                      <PropertyCard
                        property={prop}
                        onViewDetails={handleViewDetails}
                        onSave={handleSaveFromCard}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-8">
                <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="text-black font-semibold px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Prev</button>
                <div className="text-sm font-medium">Page <span className="font-bold">{page}</span> of <span className="font-semibold">{totalPages}</span></div>
                <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="text-black font-semibold px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Next</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ to='#', icon, text, collapsed, active }){
  return (
    <Link to={to} className={`flex items-center gap-3 p-2 rounded-md text-sm text-gray-100 hover:bg-white/5 transition ${collapsed?'justify-center':''} ${active?'bg-white/5 scale-[1.02]':''}`}>
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5">{icon}</div>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
}

export default AdmPropt;
