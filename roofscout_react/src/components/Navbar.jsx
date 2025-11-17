import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---------------------------------------
  // NEW MODE SYSTEM (Buy / Rent)
  // ---------------------------------------
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "buy"; // default = BUY
  });

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  // ---------------------------------------
  // DARK MODE
  // ---------------------------------------
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ---------------------------------------
  // OTHER STATES
  // ---------------------------------------
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // ---------------------------------------
  // SCROLL & LOGIN DETECTION
  // ---------------------------------------
  useEffect(() => {
    const storedName = sessionStorage.getItem("loggedUser");
    if (storedName) setLoggedUser(storedName);

    const handleScroll = () => {
      const threshold = 12;
      const lgBreakpoint = 1024;
      const isLargeScreen = window.innerWidth >= lgBreakpoint;
      setIsScrolled(isLargeScreen && window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // ---------------------------------------
  // SEARCH FUNCTION
  // ---------------------------------------
  const handleSearch = () => {
    const state = searchValue.trim().toLowerCase();
    if (!state) return alert("Please enter a state to search.");

    const path = mode === "rent" ? "/statesrent" : "/states";
    navigate(`${path}?state=${encodeURIComponent(state)}`);
    setSearchValue("");
  };

  // ---------------------------------------
  // NAVBAR STYLE (unchanged)
  // ---------------------------------------
  const navbarClasses = `sticky top-0 z-50 flex gap-10 h-20 p-4 items-center shadow-lg transition-all duration-300 ${
    isScrolled
      ? "rounded-3xl w-5/6 ml-[148px] shadow-2xl bg-gray-200/20 dark:bg-gray-800/30 backdrop-blur-lg border-gray-200/40 border-b-2 top-4"
      : "rounded-none shadow-lg bg-white dark:bg-gray-900 top-0"
  }`;

  return (
    <>
      <div id="navbar" className={navbarClasses}>
        {/* LOGO */}
        <div className="flex items-center mr-4">
          <img
            src="/LogoRS.png"
            alt="Logo"
            className="h-16 w-16 bg-cover bg-center mr-2 hidden sm:block"
          />
          <h1 className="font-bold text-2xl text-yellow-500">
            <Link to="/">Roof</Link>
          </h1>
          <h1 className="font-bold text-2xl text-blue-600 dark:text-teal-400">
            <Link to="/">Scout</Link>
          </h1>
        </div>

        {/* BUY / RENT DROPDOWN (UI UNCHANGED) */}
        <div className="hidden sm:flex items-center space-x-4 ml-2">
          <div className="relative">
            <div className="dropdown">
              <button className="flex items-center justify-between px-3 py-2 border-b-2 border-transparent text-sm font-bold hover:text-blue-600 dark:hover:text-teal-400 transition">
                {mode === "rent" ? "Rent" : "Buy"}
              </button>
              <div className="dropdown-menu absolute hidden h-auto bg-white dark:bg-gray-800 flex pt-4 text-sm font-bold">
                <ul className="block w-full">
                  {mode === "rent" ? (
                    <button
                      onClick={() => switchMode("buy")}
                      className="py-1 px-2 hover:text-blue-600 dark:hover:text-teal-400 text-left w-full"
                    >
                      Buy
                    </button>
                  ) : (
                    <button
                      onClick={() => switchMode("rent")}
                      className="py-1 px-2 hover:text-blue-600 dark:hover:text-teal-400 text-left w-full"
                    >
                      Rent
                    </button>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR (UI UNCHANGED) */}
        <div className="relative flex items-center w-1/2 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg sm:w-40 md:w-1/2 ml-8">
          <input
            type="text"
            placeholder="  Search States..."
            className="w-full rounded-xl h-10 sm:h-12 border border-gray-400 dark:border-gray-600 text-sm md:text-base bg-gray-200/20 dark:bg-gray-800/30 dark:text-gray-100"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <i
            className="fa-solid fa-magnifying-glass absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
            onClick={handleSearch}
          ></i>
        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <button
          id="menu-btn"
          className="lg:hidden ml-auto text-3xl text-gray-700 dark:text-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className="hidden lg:flex items-center ml-2 space-x-4">
          <button className="bg-blue-500 dark:bg-teal-500 text-white font-semibold rounded-md w-40 px-3 py-2 hover:bg-blue-600 dark:hover:bg-teal-600 transition">
            <Link to="/postproperty">Post Property</Link>
            <sup className="text-xs text-black bg-green-400 rounded-md px-1 ml-1">
              Free
            </sup>
          </button>

          <div className="gap-10 relative">
            <img
              src="/image.png"
              className="w-10 absolute top-[0px] rounded-2xl"
              alt="User"
            />
            <button
              id="login"
              className="bg-blue-500 dark:bg-teal-500 text-white font-semibold rounded-md w-40 px-4 py-2 hover:bg-blue-600 dark:hover:bg-teal-600 transition"
              onClick={() => navigate("/login")}
            >
              {loggedUser || "Login"}
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all duration-300 shadow-md"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
