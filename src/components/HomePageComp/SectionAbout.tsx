import React from 'react';

const SectionAbout: React.FC = () => {
  return (
    <section className="bg-blue-50 px-6 py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Gambar kiri */}
        <div className="w-full md:w-1/2">
          <div className="rounded-xl p-4 w-fit mx-auto">
            <img
              src="/about-illustration.png"
              alt="JobMate Image"
              className="w-[280px] md:w-[420px] rounded-xl"
            />
          </div>
        </div>

        {/* Konten kanan */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Itu JobMate?</h2>
          <p className="text-gray-700 mb-4">
            Berangkat dari permasalahan masyarakat Indonesia, JobMate berdedikasi untuk
            memberikan kesempatan dan kesejahteraan perekonomian masyarakat Indonesia.
          </p>
          <p className="text-gray-700 mb-8">
            Melalui JobMate, kami percaya dapat memberdayakan penyandang disabilitas dengan
            menyediakan akses ke pelatihan keterampilan kerja, konsultasi karir, dan kesempatan
            kerja inklusif.
          </p>

          <div className="space-y-3">
            <a
              href="/jobsearch"
              className="flex items-center font-semibold text-blue-900 hover:underline"
            >
              Cari Lowongan Pekerjaan Inklusif
              <span className="ml-2 text-sm bg-blue-900 text-white px-2 py-1 rounded-full"><img src="/arrow-white.png" className="m-0.5"/></span>
            </a>
            <a
              href="#"
              className="flex items-center font-semibold text-gray-900 hover:underline"
            >
              Review CV
              <span className="ml-2 text-sm bg-white text-black px-2 py-1 rounded-full border"><img src="/arrow.png" className="m-0.5"/></span>
            </a>
            <a
              href="#"
              className="flex items-center font-semibold text-gray-900 hover:underline"
            >
              Latihan Interview
              <span className="ml-2 text-sm bg-white text-black px-2 py-1 rounded-full border"><img src="/arrow.png" className="m-0.5"/></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionAbout;
