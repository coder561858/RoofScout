import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function PostProperty() {
  const [selectedPage, setSelectedPage] = useState('sell');
  const [propertyType, setPropertyType] = useState('residential');
  const [phone, setPhone] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  const handleStart = () => {
    const loginText = sessionStorage.getItem('loginText');
    const loggedUser = sessionStorage.getItem('loggedUser');

    if ((loginText && loginText !== 'Login') || loggedUser) {
      navigate(`/${selectedPage}`);
    } else {
      navigate(`/login?redirect=${selectedPage}`);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* ⭐ FULL LOGIN NAVBAR COPIED EXACTLY */}
      <header className="sticky top-0 z-10 shadow-lg p-4 flex justify-between items-center bg-white dark:bg-gray-800 transition-colors">
        <div className="flex items-center ml-12">
          <img
            src="/LogoRS.png"
            alt="Logo"
            className="h-16 w-16 bg-cover bg-center mr-2 hidden sm:block"
          />

          <h1 className="font-bold text-2xl text-yellow-500 px-0">
            <Link to="/">Roof</Link>
          </h1>

          <h1 className="font-bold text-2xl text-blue-600 dark:text-teal-400">
            <Link to="/">Scout</Link>
          </h1>
        </div>

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);

            if (newMode) {
              document.documentElement.classList.add("dark");
              localStorage.setItem("theme", "dark");
            } else {
              document.documentElement.classList.remove("dark");
              localStorage.setItem("theme", "light");
            }
          }}
          className="mr-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? (
            <span className="text-yellow-300 text-xl">☀️</span>
          ) : (
            <span className="text-gray-800 text-xl">🌙</span>
          )}
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto p-8 grid lg:grid-cols-2 gap-8 items-center">
        {/* LEFT SECTION */}
        <div className="space-y-6">
          <img src="/login.png" alt="RoofScout Logo" />

          <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300">
            Sell or Rent Property online faster with RoofScout
          </h2>

          <ul className="text-lg text-gray-700 dark:text-gray-300 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Advertise for FREE</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Get unlimited enquiries</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Get shortlisted buyers and tenants</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-500">✔</span>
              <span>Assistance in co-ordinating site visits</span>
            </li>
          </ul>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Start posting your property, it's free
          </h3>

          <div className="space-y-4">
            {/* PROPERTY PURPOSE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Basic Details
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">You're looking to...</p>

              <div className="mt-2 flex space-x-2">
                {[
                  { key: 'sell', label: 'Sell' },
                  { key: 'rent', label: 'Rent / Lease' },
                  { key: 'pg', label: 'PG' }
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setSelectedPage(btn.key)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedPage === btn.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PROPERTY TYPE */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-12">And it's a...</p>

              <div className="mt-2 space-y-2 text-gray-700 dark:text-gray-200">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    checked={propertyType === 'residential'}
                    onChange={() => setPropertyType('residential')}
                  />
                  <span>Residential</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type"
                    checked={propertyType === 'commercial'}
                    onChange={() => setPropertyType('commercial')}
                  />
                  <span>Commercial</span>
                </label>
              </div>
            </div>

            {/* CONTACT */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your contact details
              </label>

              <input
                type="tel"
                placeholder="Phone Number"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* LOGIN */}
            <div className="text-sm text-center mt-2">
              <p className="text-gray-500 dark:text-gray-300">
                Are you a registered user?{" "}
                <Link to="/login" className="text-blue-500 dark:text-blue-400">
                  Login
                </Link>
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors dark:hover:bg-blue-500"
            >
              Start now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostProperty;
