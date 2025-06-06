import React from 'react';

const HomepageContent: React.FC = () => {
    return (
      <>
        <section
          className="pt-16 pb-0 px-6 text-center bg-blue-50"
          style={{
            backgroundImage: 'url("/homepage-bg.png")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Raih Karir Impianmu <br /> Bersama <span className="text-blue-700">JobMate</span>
          </h1>
          <p className="text-gray-700 mt-4 max-w-xl mx-auto text-lg">
            Segera wujudkan mimpimu bekerja di perusahaan inklusif Indonesia sekarang!
          </p>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Cari Lowongan Pekerjaan, Pelatihan, atau Bootcamp"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-60 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
              Eksplor Sekarang!
            </button>
          </div>

          <div className="relative mt-5">
            <img src="/hero-image.png" alt="Inclusive Team" className="mx-auto max-h-[1000px]" />
          </div>
        </section>

        {/* Sponsor Logo Bar */}
        <div className="bg-blue-900 mt-0 py-4 grid grid-cols-3 sm:grid-cols-6 gap-4 items-center justify-items-center">
          {['unilever', 'danone', 'bca', 'pertamina', 'hsbc', 'grab'].map((logo, i) => (
            <img key={i} src={`/sponsor/${logo}.png`} alt={logo} className="h-6 md:h-10" />
          ))}
        </div>
      </>
    );
  };

export default HomepageContent;
