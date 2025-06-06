import React from 'react';

const SectionStats: React.FC = () => {
  return (
    <section className="w-full bg-blue-50 px-4 py-10">
      <div
        className="max-w-7xl mx-auto rounded-2xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/stats-bg.png")',
        }}
      >
        <div className="rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 py-6 gap-6 sm:gap-0 text-white text-center">
          {[
            { value: '380+', label: 'Pengguna JobMate' },
            { value: '100+', label: 'Lowongan Pekerjaan' },
            { value: '5+', label: 'Partner Kolaborasi' },
            { value: '10+', label: 'Program Akselerasi' },
          ].map((item, i, arr) => (
            <div
              key={i}
              className={`flex-1 px-4 ${
                i !== arr.length - 1 ? 'sm:border-r border-white/20' : ''
              }`}
            >
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionStats;
