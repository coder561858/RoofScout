import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const properties = [
  {
    id: "P001",
    title: "405 Lock House, Goa",
    subtitle: "Luxury villa with sea view near Baga Beach",
    priceText: "Rent | ₹8,000 / night",
    image: "/homehouse1.jpg",
  },
  {
    id: "P002",
    title: "308 Ganga Sagar, Nashik",
    subtitle: "Spacious 3BHK apartment with city view",
    priceText: "Buy | ₹1,00,000",
    image: "/homehouse2.jpg",
  },
  {
    id: "P003",
    title: "566, 3BHK House, Delhi",
    subtitle: "Modern home in the heart of the city",
    priceText: "Rent | ₹7,500 / month",
    image: "/homehouse3.jpg",
  },
];

export default function Home() {
  const [counters, setCounters] = useState({ homes: 0, cities: 0, buyers: 0 });

  useEffect(() => {
    setCounters({ homes: 5000, cities: 120, buyers: 200 });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Your{" "}
              <span className="text-blue-600 dark:text-teal-400">Property</span>{" "}
              Companion.
            </h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
              Rent • Sell • Purchase — all at your fingertips. RoofScout
              simplifies property discovery and management with seamless UX.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              {/* <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-[360px] p-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              /> */}
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold shadow-md transition">
                Get Started — Free
              </button>
            </div>

            <p className="mt-4 italic text-gray-600 dark:text-gray-400">
              "Simplifying property, one click at a time."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src="/newhomeproperty.png"
              alt="Property showcase"
              className="rounded-2xl shadow-2xl w-full max-w-lg object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative shadow-lg">
          <video
            className="w-full h-[60vh] object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/RSvideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center">
              Discover homes with immersive tours
            </h2>
          </div>
        </div>
      </section>

      {/* COUNTERS */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[["Homes Provided", counters.homes], ["Cities Covered", counters.cities], ["Happy Buyers", counters.buyers]].map(
            ([label, val], i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-8 shadow bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
              >
                <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                  <CountUp end={val} duration={2.5} separator="," />+
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold mt-2">
                  {label}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="p-10 bg-cover bg-center rounded-lg text-white"
        style={{ backgroundImage: "url('/service.jpg')" }}
      >
        <div className="bg-black/60 p-10 rounded-2xl">
          <h3 className="text-yellow-400 text-3xl font-bold italic mb-8 text-center">
            Our Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Buying Process",
                desc: "Find verified homes with transparent pricing and easy EMI options.",
              },
              {
                title: "Easy Rental Process",
                desc: "Hassle-free renting with verified landlords and secure agreements.",
              },
              {
                title: "Easy Selling Process",
                desc: "Reach thousands of buyers with optimized listings and expert support.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white/80 dark:bg-gray-800 text-black dark:text-gray-100 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold italic">Our Properties</h2>
            <Link
              to="/allproperties"
              className="text-blue-700 dark:text-blue-400 font-semibold underline"
            >
              See All →
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {properties.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.03 }}
                className="w-[350px] h-[500px] rounded-xl shadow-lg flex flex-col justify-end text-white font-bold text-xl relative transition-transform duration-300"
                style={{
                  backgroundImage: `url(${p.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="bg-black/50 p-4 rounded-b-xl">
                  <span className="font-semibold">{p.title}</span>
                  <span className="block text-sm font-normal">{p.subtitle}</span>
                  <div className="border-2 border-blue-600 rounded-xl px-4 py-1 w-fit bg-white text-green-700 mt-2">
                    {p.priceText}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-8 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-blue-600 dark:text-teal-400 text-3xl font-extrabold mb-12 text-center tracking-wide">
          TESTIMONIALS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="https://thumbs.dreamstime.com/b/beautiful-happy-family-standing-front-their-new-house-parnets-holding-children-keys-focus-keys-family-holding-239824741.jpg"
            alt="Happy Family"
            className="rounded-xl shadow-xl w-full object-cover"
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6"
          >
            <p className="italic text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              "Don’t let little things stop you from moving forward. Stay
              focused, stay consistent, and you’ll overcome challenges."
            </p>
            <div className="flex items-center gap-4 mt-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Client"
                className="w-12 h-12 rounded-full shadow-md border"
              />
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                Palbo & Emma
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
