import React from 'react';
import {Link} from 'react-router-dom'
import { supabase } from '../supabase';

 
// SVG Icons as React Components for clarity
const ZapIcon = () => (
  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
  </svg>
);

const DeviceIcon = () => (
  // Using Fragment to group the two SVGs that were used for "Fully Responsive"
  <>
    <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path>
    </svg>
    <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path>
    </svg>
  </>
);

const LayersIcon = () => (
  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 16v4m-2-2h4M12 3v18"></path>
  </svg>
);

async function Handlelogout(){
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      // Optionally: Show an error message to the user
    } else {
      console.log('User logged out successfully');
      // Optionally: Redirect the user to the login page or homepage
      // window.location.href = '/login'; 
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err.message);
  }

}


// Main App Component
export default function Home() {
  return (
    <div className="font-sans text-white bg-gray-900">
      {/* This is the main wrapper. 
        overflow-hidden is crucial to prevent the animated background from creating scrollbars.
      */}
      <div className="relative min-h-screen overflow-hidden">
        
        {/* Animated Gradient Background */}
        {/* Assumes 'backgroundPan' animation and 'bg-300%' size are defined in tailwind.config.js */}
        <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-300% animate-backgroundPan"></div>

        {/* Glassmorphism Navbar */}
        <header className="absolute top-0 left-0 right-0 z-10 py-5">
          <div className="container mx-auto px-6 flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="text-3xl font-black tracking-tighter text-white">
              Vibrant
            </a>
            <Link to = '/image'>
            <button className='text-blue-200 bg-purple-400 rounded-4xl p-5'
            
            >
              the image page
            </button>
            </Link>
            <Link to = '/gemini'>
            <button className='text-blue-200 bg-purple-400 rounded-4xl p-5'
            
            >
              the gemini api page
            </button>
            </Link>
            <Link to = '/summary'>
            <button className='text-blue-200 bg-purple-400 rounded-4xl p-5'
            
            >
              Image summarizer
            </button>
            </Link>
            
            {/* Navbar Buttons */}
            <nav className="flex items-center space-x-4">
              <a onClick={Handlelogout} className="bg-white/10 backdrop-blur-md text-white font-semibold py-2 px-5 rounded-full hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105">
                Log out
              </a>
              
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-0 flex items-center justify-center min-h-screen text-center px-6">
          {/* Animation container */}
          {/* Assumes 'fadeInUp' animation is defined in tailwind.config.js */}
          <div className="animate-fadeInUp" style={{ animationFillMode: 'backwards', animationDelay: '200ms' }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-4">
              Welcome to the
              {/* Animated gradient text - uses text-transparent now */}
              <span className="bg-gradient-to-r from-yellow-300 to-red-400 bg-clip-text text-transparent p-2">
                Future
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              This is a stunning, colorful, and fully animated homepage. 
              Built with utility-first Tailwind CSS and zero custom CSS files.
            </p>
            
            <a href="/image" className="bg-white text-gray-900 font-bold py-4 px-10 rounded-full text-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl active:scale-105 animate-pulse">
              Get Started Now
            </a>
          </div>
        </main>
      </div>

      {/* Feature Section */}
      <section className="relative z-10 bg-gray-900 py-20 sm:py-32">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Everything You Need
             </h2>
             <p className="text-lg text-white/70">
                Our platform is built for speed, style, and scalability.
                See what makes us different.
             </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 group">
              <div className="p-3 bg-purple-500/10 rounded-xl w-14 h-14 mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-500/20">
                <ZapIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3">Blazing Fast</h3>
              <p className="text-white/70">
                Optimized for performance, our infrastructure ensures your content is delivered in milliseconds.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20 group">
              <div className="p-3 bg-pink-500/10 rounded-xl w-14 h-14 mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-pink-500/20">
                <DeviceIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fully Responsive</h3>
              <p className="text-white/70">
                Looks stunning on all devices, from the largest desktop monitors to the smallest mobile phones.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 group">
              <div className="p-3 bg-red-500/10 rounded-xl w-14 h-14 mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500/20">
                <LayersIcon />
              </div>
              <h3 className="text-2xl font-bold mb-3">Dynamic & Animated</h3>
              <p className="text-white/70">
                Engage your users with beautiful, smooth animations that bring your content to life.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700/50 py-10">
        <div className="container mx-auto px-6 text-center text-white/50">
          <p>&copy; 2025 Vibrant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
