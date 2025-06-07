import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

const SectionStats: React.FC = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 px-4 py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
            <TrendingUp size={14} className="text-blue-600" />
            <span>Pencapaian Kami</span>
          </div>
        </div>

        {/* Stats Container */}
        <div
          className="relative rounded-3xl bg-cover bg-center bg-no-repeat shadow-2xl overflow-hidden"
          style={{
            backgroundImage: 'url("/stats-bg.png")',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-[0.5px]"></div>
          
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          
          {/* Content */}
          <div className="relative rounded-3xl flex flex-col sm:flex-row items-center justify-between px-8 py-12 gap-8 sm:gap-0 text-white text-center">
            {[
              { value: '380+', label: 'Pengguna JobMate', icon: '👥' },
              { value: '100+', label: 'Lowongan Pekerjaan', icon: '💼' },
              { value: '5+', label: 'Partner Kolaborasi', icon: '🤝' },
              { value: '10+', label: 'Program Akselerasi', icon: '🚀' },
            ].map((item, i, arr) => (
              <div
                key={i}
                className={`group flex-1 px-6 transition-all duration-300 hover:scale-105 ${
                  i !== arr.length - 1 ? 'sm:border-r border-white/30' : ''
                }`}
              >
                {/* Icon */}
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg group-hover:from-blue-200 group-hover:to-white transition-all duration-300">
                  {item.value}
                </div>
                
                {/* Label */}
                <div className="text-sm md:text-base font-medium text-white/90 group-hover:text-white transition-colors duration-300 leading-relaxed">
                  {item.label}
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
          
          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default SectionStats;