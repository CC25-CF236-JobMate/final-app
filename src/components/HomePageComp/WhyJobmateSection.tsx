import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

const WhyJobmateSection: React.FC = () => {
  const items = [
    {
      color: 'bg-gradient-to-br from-pink-200 to-pink-300',
      title: 'Review CV dengan Mudah',
      desc: 'Unggah CV lalu pilih bidang pekerjaan dan dapatkan penilaian serta rekomendasi CV profesional yang siap digunakan.',
      icon: '/icons/review.svg',
      borderColor: 'border-pink-200/50',
      iconBg: 'bg-pink-100'
    },
    {
      color: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
      title: 'Jelajahi Pilihan Pekerjaanmu',
      desc: 'Tentukan preferensimu (detail shift, gaji, lokasi, dll.) dan temukan loker inklusif yang paling sesuai untukmu.',
      icon: '/icons/search.svg',
      borderColor: 'border-yellow-200/50',
      iconBg: 'bg-yellow-100'
    },
    {
      color: 'bg-gradient-to-br from-sky-200 to-sky-300',
      title: 'Asah Kemampuanmu',
      desc: 'Akses pelatihan dan AI Interview untuk mengembangkan keterampilanmu, dan tingkatkan peluang sukses dalam karier.',
      icon: '/icons/skills.svg',
      borderColor: 'border-sky-200/50',
      iconBg: 'bg-sky-100'
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 py-16 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
          <div>
            {/* Section Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Sparkles size={14} className="text-blue-600" />
              <span>Keunggulan Kami</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mr-50 tracking-wide leading-tight">
              Mengapa Harus <br className="md:hidden" /> JobMate?
            </h2>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <p className="text-gray-600 leading-relaxed text-right text-lg ml-25">
              Kami memperkuat perjalanan Anda dengan menghubungkan bakat dengan peluang. JobMate hadir untuk melayani dan
              mendukung semua individu tanpa memandang keterbatasan.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`group relative ${item.color} border ${item.borderColor} p-8 rounded-3xl shadow-lg hover:shadow-2xl text-left transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {item.icon && (
                  <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6 ml-auto shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    <img src={item.icon} alt={item.title} className="h-8 w-8" />
                  </div>
                )}
                
                <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{item.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{item.desc}</p>
                
                <a 
                  href="#" 
                  className="group/link inline-flex items-center text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="mr-2">Mulai</span>
                  <div className="w-6 h-6 bg-white/60 group-hover/link:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 group-hover/link:shadow-md">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJobmateSection;