import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HomeRent() {
  const [counters, setCounters] = useState({ homes: 0, cities: 0, buyers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const targets = { homes: 5000, cities: 120, buyers: 200 };
    const steps = {
      homes: Math.max(1, Math.ceil(targets.homes / 100)),
      cities: Math.max(1, Math.ceil(targets.cities / 100)),
      buyers: Math.max(1, Math.ceil(targets.buyers / 100))
    };

    const intervals = {
      homes: setInterval(() => {
        setCounters(prev => {
          const newVal = prev.homes + steps.homes;
          if (newVal >= targets.homes) {
            clearInterval(intervals.homes);
            return { ...prev, homes: targets.homes };
          }
          return { ...prev, homes: newVal };
        });
      }, 20),
      cities: setInterval(() => {
        setCounters(prev => {
          const newVal = prev.cities + steps.cities;
          if (newVal >= targets.cities) {
            clearInterval(intervals.cities);
            return { ...prev, cities: targets.cities };
          }
          return { ...prev, cities: newVal };
        });
      }, 20),
      buyers: setInterval(() => {
        setCounters(prev => {
          const newVal = prev.buyers + steps.buyers;
          if (newVal >= targets.buyers) {
            clearInterval(intervals.buyers);
            return { ...prev, buyers: targets.buyers };
          }
          return { ...prev, buyers: newVal };
        });
      }, 20)
    };

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-blue-100 via-green-100 to-pink-200">
        <section className="flex flex-col md:flex-row items-center p-6 py-0 gap-10 min-h-[450px]">
          <div className="md:w-1/2 flex flex-col gap-5">
            <h1 className="text-5xl font-bold">Your idle-property</h1>
            <h1 className="text-5xl font-bold">Companion.</h1>
            <h3 className="text-gray-600 font-bold text-lg">Rent Sell Purchase. All at your fingertips.</h3>
            <div className="relative w-full md:w-2/3 mt-4">
              <input
                type="text"
                placeholder="What's Your email"
                className="w-full h-full p-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="text-black bg-yellow-300 p-2 rounded-lg whitespace-nowrap absolute bottom-1 right-1">
                Get Started for free
              </button>
            </div>
            <div>
              <p className="font-bold italic text-gray-600 text-2xl mt-2">"Simplifying property, one click at a time."</p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
            <img src="/newhomeproperty.png" className="rounded-lg w-full max-w-lg object-contain" alt="Property" />
          </div>
        </section>

        <section className="w-full flex justify-center items-center py-12 px-4">
          <video className="w-full max-h-[70vh] object-fill" autoPlay loop muted playsInline>
            <source src="/RSvideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10 py-0">
          <div className="w-full h-64 p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 bg-green-200 py-0">
            <h2 className="text-4xl font-bold text-gray-700">{counters.homes}+</h2>
            <p className="text-xl font-bold text-gray-800">Homes provided</p>
          </div>
          <div className="w-full h-64 p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 bg-yellow-100">
            <h2 className="text-4xl font-bold text-gray-700">{counters.cities}+</h2>
            <p className="text-xl font-bold text-gray-800">Cities covered</p>
          </div>
          <div className="w-full h-64 p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 bg-blue-100">
            <h2 className="text-4xl font-bold text-gray-700">{counters.buyers}+</h2>
            <p className="text-xl font-bold text-gray-800">Happy Buyers</p>
          </div>
        </section>

        <section className="flex flex-col p-6 gap-7 text-start">
          <div className="text-gray-600 font-serif flex flex-col items-center justify-center text-lg">
            Over 1,000 lives have found a roof they love with RoofScout.
          </div>
          <p className="text-black-600 text-lg">RoofScout Product Suite</p>
          <h1 className="font-bold text-2xl">MEET ROOFSCOUT</h1>
          <p className="text-xl max-w-3xl items-start">
            From search to saved favorites, RoofScout is the complete property companion that makes your home journey faster, smarter, and stress-free.
          </p>
        </section>

        <section className="p-3 w-full">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-center bg-no-repeat p-10 w-full h-full bg-cover rounded-lg min-h-[300px]"
            style={{ backgroundImage: "url('/service.jpg')" }}
          >
            <h3 className="col-span-full text-yellow-400 font-bold text-3xl italic mb-6 p-2 rounded-lg text-center md:text-left">
              Our Services
            </h3>

            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Easy Buying Process</h3>
              <p>We simplify the home buying process with our user-friendly platform and an exclusive option of choosing your dream home under your budget</p>
            </div>

            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Easy Rental Process</h3>
              <p>We make renting hassle-free with our streamlined process, ensuring you find the perfect rental property quickly and easily.</p>
            </div>

            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Easy Selling Process</h3>
              <p>We simplify the home selling process with our expert guidance and a platform that connects you with potential buyers efficiently.</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="flex flex-row items-center justify-between px-8 mb-6">
            <h1 className="font-bold italic text-gray-900 text-xl">OUR PROPERTIES</h1>
            <div className="flex flex-row items-center gap-2 transition-transform duration-300 hover:scale-105 cursor-pointer">
              <Link to="/allproperties" className="font-bold text-lg m-0 text-gray-900">
                All Properties &gt;
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 justify-center px-6">
            <div
              className="w-[350px] h-[500px] rounded-xl shadow-md flex flex-col justify-end text-white font-bold text-xl relative transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: "url('/homehouse1.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-black bg-opacity-40 p-3 w-full flex flex-col gap-2 rounded-b-xl">
                <span className="font-semibold">405 Lock House, Goa</span>
                <span className="text-sm">Luxury villa with sea view near Baga Beach.</span>
                <div className="border-2 border-blue-600 rounded-xl px-4 py-1 w-fit bg-white text-green-700">rent | $100</div>
                <div className="text-sm italic text-blue-500 hover:underline cursor-pointer">View Details &gt;</div>
              </div>
            </div>

            <div
              className="w-[350px] h-[500px] rounded-xl shadow-md flex flex-col justify-end text-white font-bold text-xl relative transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: "url('/homehouse2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-black bg-opacity-40 p-3 w-full flex flex-col gap-2 rounded-b-xl">
                <span className="font-semibold">308, Ganga Sagar House, Nashik</span>
                <span className="text-sm">Spacious 3BHK apartment with city view.</span>
                <div className="border-2 border-blue-600 rounded-xl px-4 py-1 w-fit bg-white text-green-700">buy | $100000</div>
                <div className="text-sm italic text-blue-500 hover:underline cursor-pointer">View Details &gt;</div>
              </div>
            </div>

            <div
              className="w-[350px] h-[500px] rounded-xl shadow-md flex flex-col justify-end text-white font-bold text-xl relative transition-transform duration-300 hover:scale-105"
              style={{
                backgroundImage: "url('/homehouse3.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-black bg-opacity-40 p-3 w-full flex flex-col gap-2 rounded-b-xl">
                <span className="font-semibold">566, 3BHK House, Delhi</span>
                <span className="text-sm">Modern home in the heart of the city.</span>
                <div className="border-2 border-blue-600 rounded-xl px-4 py-1 w-fit bg-white text-green-700">rent | $100</div>
                <div className="text-sm italic text-blue-500 hover:underline cursor-pointer">View Details &gt;</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 border-t-2 border-black">
          <h2 className="text-blue-600 text-3xl font-extrabold mb-12 text-center tracking-wide">TESTIMONIALS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="https://thumbs.dreamstime.com/b/beautiful-happy-family-standing-front-their-new-house-parnets-holding-children-keys-focus-keys-family-holding-239824741.jpg"
                alt="Testimonial from Palbo & Emma"
                className="rounded-xl shadow-xl max-w-lg w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex flex-col">
                <div className="flex items-start gap-3">
                  <p className="text-gray-700 leading-relaxed italic text-lg">
                    "Don't let little things stop you from moving forward. Stay focused, stay consistent, and you'll overcome challenges."
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Client"
                    className="w-12 h-12 rounded-full shadow-md border hover:scale-105 transition-transform"
                  />
                  <span className="font-semibold text-gray-900 text-lg">Palbo & Emma</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomeRent;

