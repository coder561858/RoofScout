import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpUsernameOrEmail, setSignUpUsernameOrEmail] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load dark mode from storage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update theme on toggle
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const signUpClasses = `absolute inset-y-0 left-0 w-1/2 z-10 transition-all duration-700 ease-in-out
    flex flex-col items-center justify-center p-10
    bg-white dark:bg-gray-800 dark:text-white
    ${isActive ? "opacity-100 z-30 translate-x-full" : "opacity-0 pointer-events-none"}`;

  const signInClasses = `absolute inset-y-0 left-0 w-1/2 z-20 transition-all duration-700 ease-in-out
    flex flex-col items-center justify-center p-10
    bg-white dark:bg-gray-800 dark:text-white
    ${isActive ? "translate-x-full" : ""}`;

  const toggleContainerClasses = `absolute top-0 left-1/2 w-1/2 h-full overflow-hidden
    transition-all duration-700 ease-in-out z-50
    ${isActive ? "-translate-x-full rounded-[0_150px_100px_0]" : "rounded-[150px_0_0_100px]"}`;

  const toggleClasses = `absolute left-[-100%] top-0 h-full w-[200%]
    transition-all duration-700 ease-in-out
    bg-gradient-to-r from-indigo-600 to-teal-500 text-white
    ${isActive ? "translate-x-1/2" : ""}`;

  const handleSignIn = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      navigate("/AdminDashboard");
    } else {
      if (username) sessionStorage.setItem("loggedUser", username);
      navigate("/userdashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300 bg-gray-200 dark:bg-gray-900">
      {/* HEADER */}
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
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          id="container"
          className="relative overflow-hidden w-[768px] max-w-full min-h-[480px]
          bg-white dark:bg-gray-800 dark:text-white rounded-[30px]
          shadow-[0_5px_15px_rgba(0,0,0,0.35)]"
        >
          {/* SIGN UP */}
          <div id="signUp" className={signUpClasses}>
            <form className="w-full max-w-xs">
              <h1 className="text-3xl font-semibold">Create Account</h1>
              <p className="text-xs mt-5 text-gray-500 dark:text-gray-300 text-center">
                or use your email for registration
              </p>

              <input type="text" placeholder="Name"
                className="mt-3 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={signUpName} onChange={(e) => setSignUpName(e.target.value)} />

              <input type="text" placeholder="Username or Email"
                className="mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={signUpUsernameOrEmail} onChange={(e) => setSignUpUsernameOrEmail(e.target.value)} />

              <input placeholder="Email"
                className="mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />

              <input type="password" placeholder="Password"
                className="mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />

              <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold uppercase px-10 py-2 rounded-md w-full">
                Sign Up
              </button>
            </form>
          </div>

          {/* SIGN IN */}
          <div id="signIn" className={signInClasses}>
            <form className="w-full max-w-xs" onSubmit={handleSignIn}>
              <h1 className="text-3xl font-semibold">Sign In</h1>
              <p className="text-xs mt-5 text-gray-500 dark:text-gray-300 text-center">
                or use your email password
              </p>

              <input type="text" placeholder="Username"
                className="mt-3 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={username} onChange={(e) => setUsername(e.target.value)} />

              <input type="password" placeholder="Password"
                className="mt-2 w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm outline-none"
                value={password} onChange={(e) => setPassword(e.target.value)} />

              <a href="#" className="block text-xs text-gray-600 dark:text-gray-300 mt-3">
                Forget Your Password?
              </a>

              <button type="submit"
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold uppercase px-10 py-2 rounded-md w-full">
                Sign In
              </button>
            </form>
          </div>

          {/* OVERLAY PANELS */}
          <div id="toggleContainer" className={toggleContainerClasses}>
            <div id="toggle" className={toggleClasses}>
              <div id="panelLeft"
                className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center">
                <h1 className="text-3xl font-semibold">Welcome Back!</h1>
                <p className="mt-4 text-sm leading-5">Enter your personal details to use all site features</p>
                <button onClick={() => setIsActive(false)}
                  className="mt-6 border border-white text-white bg-transparent hover:bg-white/10 text-xs font-semibold uppercase px-10 py-2 rounded-md">
                  Sign In
                </button>
              </div>

              <div id="panelRight"
                className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center">
                <h1 className="text-3xl font-semibold">Hello, Friend!</h1>
                <p className="mt-4 text-sm leading-5">Register with your details to use all site features</p>
                <button onClick={() => setIsActive(true)}
                  className="mt-6 border border-white text-white bg-transparent hover:bg-white/10 text-xs font-semibold uppercase px-10 py-2 rounded-md">
                  Sign Up
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
