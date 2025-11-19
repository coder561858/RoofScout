import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react'; 

function PostProperty() {
  const [selectedPage, setSelectedPage] = useState('sell');
  // Removed: propertyType state as it was not used in navigation logic.
  // Removed: phone state as it was not used in navigation logic.

  const navigate = useNavigate();

  // 1. --- CLEANED DARK MODE STATE AND LOGIC ---
  const [theme, setTheme] = useState(() => {
    try { 
      // Use the 'rs-theme' key for consistency with other components
      return localStorage.getItem('rs-theme') || 'light'; 
    } catch { 
      return 'light'; 
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    try { 
      // Use the 'rs-theme' key for consistency
      localStorage.setItem('rs-theme', theme); 
    } catch {}
  }, [theme]);

  const handleStart = () => {
    // Note: The original code checks for 'loginText' AND 'loggedUser'. 
    // We assume 'loggedUser' is sufficient for a logged-in check.
    const loggedUser = sessionStorage.getItem('loggedUser');
    const isLoggedIn = loggedUser;

    if (isLoggedIn) {
      // Direct navigation to the selected property page (Sell, Rent, or PG)
      navigate(`/${selectedPage}`);
    } else {
      // Redirect to login, specifying where to go after successful login
      navigate(`/login?redirect=${selectedPage}`);
    }
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* 🏡 STICKY HEADER / NAVBAR */}
      <header className={`sticky top-0 z-10 shadow-md p-4 flex justify-between items-center ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } transition-colors duration-300`}>
        <div className="flex items-center ml-4 sm:ml-12">
          {/* Using a placeholder/mock image tag for simplicity based on previous files */}
          <div className="flex items-center gap-3">
            <img src="/logoRS.jpg" className="h-12 w-12 rounded-full hidden sm:block" alt="RoofScout Logo" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <Link to="/" className="text-yellow-500">Roof</Link>
                <Link to="/" className="text-blue-600 dark:text-teal-400">Scout</Link>
              </h1>
            </div>
          </div>
        </div>

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="mr-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-yellow-300" />
          ) : (
            <Moon size={20} className="text-gray-800" />
          )}
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto p-4 md:p-8 grid lg:grid-cols-2 gap-8 items-center pt-12">
        {/* LEFT SECTION (Marketing/Benefits) */}
        <div className="space-y-6">
          <img 
            src="/login.png" 
            alt="Real Estate Concept" 
            className="w-full max-w-lg mx-auto"
          />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 dark:text-blue-300">
            Sell or Rent Property online faster with RoofScout
          </h2>

          <ul className="text-lg text-gray-700 dark:text-gray-300 space-y-3">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 text-xl font-bold">✔</span>
              <span>*Advertise for FREE* – Zero listing fees.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 text-xl font-bold">✔</span>
              <span>Get *unlimited enquiries* from genuine seekers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 text-xl font-bold">✔</span>
              <span>Get shortlisted buyers and tenants quickly.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 text-xl font-bold">✔</span>
              <span>Assistance in co-ordinating site visits.</span>
            </li>
          </ul>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Start posting your property, it's quick and free!
          </h3>

          <div className="space-y-6">
            
            {/* PROPERTY PURPOSE */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                1. What are you looking to do?
              </label>
              
              <div className="mt-2 flex space-x-3">
                {[
                  { key: 'sell', label: 'Sell' },
                  { key: 'rent', label: 'Rent / Lease' },
                  { key: 'pg', label: 'PG' }
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setSelectedPage(btn.key)}
                    className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      selectedPage === btn.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Removed the unused 'PROPERTY TYPE' and 'CONTACT' fields to simplify flow */}
            <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your current selection will redirect you to the <span className="font-bold text-blue-600 dark:text-blue-300 capitalize">{selectedPage}</span> listing form.
                </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleStart}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-700 transition-colors shadow-lg dark:hover:bg-green-500 mt-6"
            >
              Start Listing for Free →
            </button>
            
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostProperty;