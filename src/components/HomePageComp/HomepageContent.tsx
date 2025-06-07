import React from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';

const HomepageContent: React.FC = () => {
    return (
      <>
        <section
          className="relative pt-16 pb-0 px-6 text-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 overflow-hidden"
          style={{
            backgroundImage: 'url("/homepage-bg.png")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10">
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-6 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm">
              <Sparkles size={16} className="text-blue-600" />
              <span>Platform Karir Terdepan Indonesia</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight mb-6">
              Raih Karir Impianmu <br /> 
              Bersama <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">JobMate</span>
            </h1>
            
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
              Segera wujudkan mimpimu bekerja di perusahaan inklusif Indonesia sekarang!
            </p>

            {/* Enhanced Search Section */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-xl shadow-blue-900/10 p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari Lowongan Pekerjaan, Pelatihan, atau Bootcamp"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/70"
                    />
                  </div>
                  <button className="group w-full md:w-60 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    Eksplor Sekarang!
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mt-12">
              <div className="relative">
                <img 
                  src="/hero-image.png" 
                  alt="Inclusive Team" 
                  className="mx-auto max-h-[1000px] drop-shadow-2xl"
                />
                {/* Subtle overlay effects */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-20 bg-gradient-to-t from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Sponsor Logo Bar */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 mt-0 py-8 overflow-hidden">
          {/* Background pattern for sponsor section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full filter blur-2xl"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-300 rounded-full filter blur-2xl"></div>
          </div>
          
          <div className="relative">
            {/* Section title */}
            <div className="text-center mb-6">
              <p className="text-blue-100 text-sm font-medium tracking-wide uppercase">Dipercaya oleh perusahaan terkemuka</p>
            </div>
            
            {/* Logo grid with enhanced styling */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center justify-items-center max-w-6xl mx-auto px-6">
              {['unilever', 'danone', 'bca', 'pertamina', 'hsbc', 'grab'].map((logo, i) => (
                <div 
                  key={i}
                  className="group relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                >
                  <img 
                    src={`/sponsor/${logo}.png`} 
                    alt={logo} 
                    className="h-6 md:h-10 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300" 
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

export default HomepageContent;