import React from 'react';
import { ArrowRight, Search, FileText, MessageCircle, Sparkles } from 'lucide-react';

const SectionAbout: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 px-6 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Gambar kiri */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-3xl p-4 w-fit mx-auto">
            {/* Subtle glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-3xl blur-2xl transform scale-110"></div>
            <div className="relative bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-2xl">
              <img
                src="/about-illustration.png"
                alt="JobMate Image"
                className="w-[280px] md:w-[420px] rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Konten kanan */}
        <div className="w-full md:w-1/2 text-left">
          {/* Section Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Sparkles size={14} className="text-blue-600" />
            <span>Tentang JobMate</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
            Apa Itu JobMate?
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              Berangkat dari permasalahan masyarakat Indonesia, JobMate berdedikasi untuk
              memberikan kesempatan dan kesejahteraan perekonomian masyarakat Indonesia.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Melalui JobMate, kami percaya dapat memberdayakan penyandang disabilitas dengan
              menyediakan akses ke pelatihan keterampilan kerja, konsultasi karir, dan kesempatan
              kerja inklusif.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/jobsearch"
              className="group flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <span>Cari Lowongan Pekerjaan Inklusif</span>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </a>

            <a
              href="/cvreview"
              className="group flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-200/50 text-gray-800 font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span>Review CV</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </a>

            <a
              href="/services/ai-interview"
              className="group flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-blue-200/50 text-gray-800 font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <span>Latihan Interview</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionAbout;