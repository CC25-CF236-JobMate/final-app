import React from 'react';

const WhyJobmateSection: React.FC = () => {
  const items = [
    {
      color: 'bg-pink-300',
      title: 'Review CV dengan Mudah',
      desc: 'Unggah CV lalu pilih bidang pekerjaan dan dapatkan penilaian serta rekomendasi CV profesional yang siap digunakan.',
      icon: '/icons/review.svg',
    },
    {
      color: 'bg-yellow-300',
      title: 'Jelajahi Pilihan Pekerjaanmu',
      desc: 'Tentukan preferensimu (detail shift, gaji, lokasi, dll.) dan temukan loker inklusif yang paling sesuai untukmu.',
      icon: '/icons/search.svg',
    },
    {
      color: 'bg-sky-300',
      title: 'Asah Kemampuanmu',
      desc: 'Akses pelatihan dan AI Interview untuk mengembangkan keterampilanmu, dan tingkatkan peluang sukses dalam karier.',
      icon: '/icons/skills.svg',
    },
  ];

  return (
    <section className="bg-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mr-50 tracking-wide">
            Mengapa Harus <br className="md:hidden" /> JobMate?
          </h2>
          <p className="text-gray-700 leading-relaxed text-right text-lg ml-25">
            Kami memperkuat perjalanan Anda dengan menghubungkan bakat dengan peluang. JobMate hadir untuk melayani dan
            mendukung semua individu tanpa memandang keterbatasan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${item.color} p-6 rounded-xl shadow-sm text-left hover:shadow-md transition`}
            >
              {item.icon && (
                <img src={item.icon} alt={item.title} className="h-10 mb-4 ml-40" />
              )}
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700 mb-4">{item.desc}</p>
              <a href="#" className="text-sm font-semibold inline-flex items-center">
                Mulai <span className="ml-1">➔</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJobmateSection;
