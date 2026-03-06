import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { localAuth } from "../supabase";
import { useTheme } from "../hooks/useTheme";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // BUY / RENT MODE
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "buy";
  });

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  // DARK MODE
  const [theme, setTheme] = useTheme();
  const darkMode = theme === 'dark';
  const setDarkMode = (val) => setTheme(val ? 'dark' : 'light');

  // ---------------- USERNAME FROM SUPABASE / LOCAL ----------------
  const [username, setUsername] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  async function loadUser() {
    let finalAuthUser = null;
    let finalUsername = null;

    // 1. Try to get Supabase / local session
    const { data: sessionData } = localAuth.getSession();
    const session = sessionData.session;

    // 2. Try to get legacy session user
    const legacySessionUser = sessionStorage.getItem("loggedUser");

    if (session?.user) {
      finalAuthUser = session.user;
      finalUsername = session.user.username || session.user.name || session.user.email;
    } else if (legacySessionUser) {
      finalAuthUser = { id: legacySessionUser }; // Mock user object so UI knows we are logged in
      finalUsername = legacySessionUser;
    }

    // 3. Always check if user updated their profile name locally, which overrides email
    if (finalAuthUser) {
      try {
        const localProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (localProfile && localProfile.name) {
          finalUsername = localProfile.name;
        }
      } catch (e) { }
    }

    // 4. Strip @domain.com if the username is still an email
    if (finalUsername && finalUsername.includes('@')) {
      finalUsername = finalUsername.split('@')[0];
    }

    setAuthUser(finalAuthUser);
    setUsername(finalUsername || null);
  }

  useEffect(() => {
    loadUser();

    const { data: listener } = localAuth.onAuthStateChange(() => {
      loadUser();
    });

    window.addEventListener("usernameUpdated", loadUser);

    return () => {
      listener?.subscription?.unsubscribe();
      window.removeEventListener("usernameUpdated", loadUser);
    };
  }, []);

  // ---------------- SCROLL + SEARCH ----------------
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.innerWidth >= 1024 && window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleSearch = () => {
    const state = searchValue.trim().toLowerCase();
    if (!state) return alert("Please enter a state to search.");

    const path = mode === "rent" ? "/statesrent" : "/states";
    navigate(`${path}?state=${encodeURIComponent(state)}`);
    setSearchValue("");
  };

  const navbarClasses = `sticky top-0 z-50 flex gap-10 h-20 p-4 items-center shadow-lg transition-all duration-300 
  ${isScrolled
      ? "rounded-3xl w-5/6 ml-[148px] shadow-2xl bg-gray-200/20 dark:bg-gray-800/30 backdrop-blur-lg border-gray-200/40 border-b-2 top-4"
      : "rounded-none shadow-lg bg-white dark:bg-gray-900 top-0"
    }`;

  return (
    <>
      <div id="navbar" className={navbarClasses}>

        {/* LOGO */}
        <div className="flex items-center mr-4">
          <img src="/LogoRS.png" alt="Logo" className="h-16 w-16 mr-2 hidden sm:block" />
          <h1 className="font-bold text-2xl text-yellow-500"><Link to="/">Roof</Link></h1>
          <h1 className="font-bold text-2xl text-blue-600 dark:text-teal-400"><Link to="/">Scout</Link></h1>
        </div>

        {/* BUY / RENT */}
        <div className="hidden sm:flex items-center space-x-4 ml-2">
          <div className="relative dropdown">
            <button className="px-3 py-2 text-sm font-bold">
              {mode === "rent" ? "Rent" : "Buy"}
            </button>
            <div className="dropdown-menu absolute hidden bg-white dark:bg-gray-800 pt-4">
              {mode === "rent" ? (
                <button onClick={() => switchMode("buy")} className="py-1 px-2">Buy</button>
              ) : (
                <button onClick={() => switchMode("rent")} className="py-1 px-2">Rent</button>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative flex items-center w-1/2 sm:w-40 md:w-1/2 ml-8 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder="  Search States..."
            className="w-full rounded-xl h-10 sm:h-12 bg-gray-200/20 dark:bg-gray-800/30"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <i
            className="fa-solid fa-magnifying-glass absolute right-3 cursor-pointer"
            onClick={handleSearch}
          ></i>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center ml-2 space-x-4">

          {/* POST PROPERTY */}
          <button className="bg-blue-500 dark:bg-teal-500 text-white font-semibold rounded-md w-40 px-3 py-2">
            <Link to="/postproperty">Post Property</Link>
            <sup className="text-xs text-black bg-green-400 rounded-md px-1 ml-1">Free</sup>
          </button>

          {/* USER BUTTON */}
          <div className="relative flex items-center">
            {authUser && (
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden absolute left-0 z-10 shadow-sm ml-1">
                <img src="/image.png" className="w-full h-full object-cover" alt="User" />
              </div>
            )}
            <button
              id="login"
              className={`bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-teal-500 dark:to-emerald-500 dark:hover:from-teal-600 dark:hover:to-emerald-600 text-white font-bold rounded-xl h-10 transition-all shadow-md flex items-center ${authUser ? 'pl-12 pr-4 w-40' : 'px-6 w-auto'}`}
              onClick={() => {
                if (authUser) {
                  const role = localStorage.getItem("role") || (authUser && authUser.role) || "user";
                  if (role === 'admin') navigate("/AdminDashboard");
                  else navigate("/userdashboard");
                }
                else {
                  navigate("/login");
                }
              }}
            >
              <span className="truncate w-full text-center leading-none">
                {username ? username : "Login"}
              </span>
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
