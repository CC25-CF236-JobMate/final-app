// src/pages/BookmarkPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookmarkList } from '../components/BookmarkComp/BookmarkComponents'; // Import dari file komponen baru
import { getEnrichedBookmarks, removeBookmark, type EnrichedBookmark } from '../services/bookmarkService'; // Import service yang diperbarui
import { Bookmark } from 'lucide-react';
import Swal from 'sweetalert2';

const BookmarkPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<EnrichedBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEnrichedBookmarks();
      setBookmarks(data);
    } catch (err: any) {
      console.error("Failed to fetch bookmarked jobs:", err);
      setError(err.message || 'Gagal memuat lowongan yang disimpan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (bookmarkId: string, jobTitle: string) => {
    const originalBookmarks = [...bookmarks];
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));

    try {
      await removeBookmark(bookmarkId); // Menggunakan bookmarkId
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `"${jobTitle}" dihapus`,
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
      });
    } catch (err: any) {
      setBookmarks(originalBookmarks); // Kembalikan state jika gagal
      console.error("Failed to remove bookmark:", err);
       Swal.fire('Gagal!', err.message || 'Gagal menghapus bookmark.', 'error');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
                <Bookmark size={32} className="mr-3 text-blue-600"/>
                Lowongan Tersimpan
            </h1>
            <p className="mt-2 text-gray-600">Daftar pekerjaan yang telah Anda simpan untuk dilihat kembali nanti.</p>
        </div>
        
        <BookmarkList 
          bookmarks={bookmarks}
          isLoading={isLoading}
          error={error}
          onRemoveBookmark={handleRemoveBookmark}
        />
      </main>
      <Footer />
    </div>
  );
};

export default BookmarkPage;
