import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-12 text-sm text-gray-700">
        {/* Kiri - Logo & Deskripsi */}
        <div className="max-w-sm">
            <img src="/logo.png" alt="DisaBisa Logo" className="h-15 mb-4" />
            <p className="text-gray-600">
            Tempat terbaik untuk melatih keterampilan dan menemukan lowongan pekerjaan inklusif
            </p>
        </div>

        {/* Kanan - Semua Link */}
        <div className="flex flex-col sm:flex-row gap-12">
            <div>
            <h3 className="font-semibold mb-3">Partner with us</h3>
            <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Partner Overview</a></li>
                <li><a href="#" className="hover:underline">Job Board API</a></li>
                <li><a href="#" className="hover:underline">Email Alert Program</a></li>
                <li><a href="#" className="hover:underline">Job Board Software</a></li>
            </ul>
            </div>
            <div>
            <h3 className="font-semibold mb-3">DisaBisa</h3>
            <ul className="space-y-1">
                <li><a href="#" className="hover:underline">About us</a></li>
                <li><a href="#" className="hover:underline">Why DisaBisa</a></li>
                <li><a href="#" className="hover:underline">Testimonials</a></li>
                <li><a href="#" className="hover:underline">Promotions</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Podcasts</a></li>
                <li><a href="#" className="hover:underline">Forum</a></li>
            </ul>
            </div>
            <div>
            <h3 className="font-semibold mb-3">Help</h3>
            <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Contact us</a></li>
                <li><a href="#" className="hover:underline">My account</a></li>
            </ul>
            </div>
        </div>
        </div>

      {/* Social & Copyright */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-col md:flex-row items-center justify-between border-t pt-4 border-gray-200">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <a href="#"><img src="/facebook.png" alt="Facebook" className="h-6 w-6" /></a>
          <a href="#"><img src="/linkedin.png" alt="LinkedIn" className="h-6 w-6" /></a>
          <a href="#"><img src="/twitter.png" alt="Twitter" className="h-6 w-6" /></a>
          <a href="#"><img src="/instagram.png" alt="Instagram" className="h-6 w-6" /></a>
        </div>
        <p className="text-xs text-gray-500">
          Copyright © 2024 all rights reserved DisaBisa
        </p>
      </div>
    </footer>
  );
};

export default Footer;
