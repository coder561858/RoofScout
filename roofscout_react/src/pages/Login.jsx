import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login1() {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsernameOrEmail, setSignUpUsernameOrEmail] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const navigate = useNavigate();

  const signUpClasses = `absolute inset-y-0 left-0 w-1/2 z-10 transition-all duration-700 ease-in-out flex flex-col items-center justify-center bg-white p-10 ${
    isActive ? 'opacity-100 z-30 translate-x-full' : 'opacity-0 pointer-events-none'
  }`;

  const signInClasses = `absolute inset-y-0 left-0 w-1/2 z-20 transition-all duration-700 ease-in-out flex flex-col items-center justify-center bg-white p-10 ${
    isActive ? 'translate-x-full' : ''
  }`;

  const toggleContainerClasses = `absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-50 ${
    isActive ? '-translate-x-full rounded-[0_150px_100px_0]' : 'rounded-[150px_0_0_100px]'
  }`;

  const toggleClasses = `absolute left-[-100%] top-0 h-full w-[200%] transition-all duration-700 ease-in-out bg-gradient-to-r from-indigo-600 to-teal-500 text-white ${
    isActive ? 'translate-x-1/2' : ''
  }`;

  const handleSignUp = (e) => {
    e.preventDefault();
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin123') {
      navigate('/AdminDashboard');
    } else {
      if (username) {
        sessionStorage.setItem('loggedUser', username);
      }
      navigate('/userdashboard');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-r from-gray-200 to-indigo-200"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <header className="sticky top-0 z-10 shadow-lg p-4 flex justify-between items-center flex-none bg-white">
        <div className="flex items-center ml-4 md:ml-12">
          <img src="/logoRS.jpg" alt="RoofScout Logo" className="h-10 w-10 md:h-12 md:w-12 bg-cover rounded-full" />
          <h1 className="font-bold text-xl md:text-2xl text-blue-600 px-1">
            <Link to="/" className="hover:text-blue-700 transition-colors">Roof</Link>
          </h1>
          <h1 className="font-bold text-xl md:text-2xl text-gray-800">
            <Link to="/" className="hover:text-gray-900 transition-colors">Scout</Link>
          </h1>
        </div>
        <div className="flex items-center gap-3 mr-4 md:mr-12">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline font-medium">Home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          id="container"
          className="relative overflow-hidden w-[768px] max-w-full min-h-[480px] bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)]"
        >
        {/* Sign Up */}
        <div id="signUp" className={signUpClasses}>
          <form className="w-full max-w-xs" onSubmit={handleSignUp}>
            <h1 className="text-3xl font-semibold text-gray-800 text-center">Create Account</h1>
            <p className="text-xs text-gray-500 text-center mt-5">or use your email for registration</p>
            <input
              type="text"
              placeholder="Name"
              className="mt-3 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username or Email"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={signUpUsernameOrEmail}
              onChange={(e) => setSignUpUsernameOrEmail(e.target.value)}
            />
            <input
              // type="email"
              placeholder="Email"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <button type="submit" className="mt-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold tracking-wide uppercase px-10 py-2 rounded-md w-full">Sign Up</button>
          </form>
        </div>

        {/* Sign In */}
        <div id="signIn" className={signInClasses}>
          <form className="w-full max-w-xs" onSubmit={handleSignIn}>
            <h1 className="text-3xl font-semibold text-gray-800 text-center">Sign In</h1>
            <p className="text-xs text-gray-500 text-center mt-5">or use your email password</p>
            <input
              type="text"
              placeholder="Username"
              className="mt-3 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="mt-2 w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className="block text-xs text-gray-600 mt-3">Forget Your Password?</a>
            <button type="submit" className="mt-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold tracking-wide uppercase px-10 py-2 rounded-md w-full">Sign In</button>
          </form>
        </div>

        {/* Toggle Overlay */}
        <div id="toggleContainer" className={toggleContainerClasses}>
          <div id="toggle" className={toggleClasses}>
            <div id="panelLeft" className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center">
              <h1 className="text-3xl font-semibold">Welcome Back!</h1>
              <p className="mt-4 text-sm leading-5">Enter your personal details to use all of site features</p>
              <button onClick={() => setIsActive(false)} className="mt-6 border border-white text-white bg-transparent hover:bg-white/10 text-xs font-semibold tracking-wide uppercase px-10 py-2 rounded-md">
                Sign In
              </button>
            </div>
            <div id="panelRight" className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center">
              <h1 className="text-3xl font-semibold">Hello, Friend!</h1>
              <p className="mt-4 text-sm leading-5">Register with your personal details to use all of site features</p>
              <button onClick={() => setIsActive(true)} className="mt-6 border border-white text-white bg-transparent hover:bg-white/10 text-xs font-semibold tracking-wide uppercase px-10 py-2 rounded-md">
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

export default Login1;