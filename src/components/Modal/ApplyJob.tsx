// src/components/Modal/ApplyJobModal.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import Swal from 'sweetalert2';
import { submitApplication } from '../../services/ApplicationService';
import { X, UploadCloud, Send, FileText, StickyNote } from 'lucide-react';

interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
  onApplySuccess: () => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ jobId, jobTitle, companyName, onClose, onApplySuccess }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [base64Resume, setBase64Resume] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Format Salah', 'Hanya file PDF yang diizinkan.', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire('Ukuran Terlalu Besar', 'Ukuran file PDF maksimal 5MB.', 'error');
        e.target.value = '';
        return;
      }
      setResumeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBase64Resume(result.split(',')[1]); // Ambil hanya bagian base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !base64Resume) {
      Swal.fire('File Dibutuhkan', 'Mohon unggah CV/Resume Anda dalam format PDF.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitApplication({
        jobId,
        resumeFile: base64Resume,
        coverLetter,
        notes,
      });
      onApplySuccess(); // Panggil callback sukses
      onClose(); // Tutup modal
    } catch (err: any) {
      console.error("Failed to submit application:", err);
      setError(err.message || "Gagal mengirim lamaran. Mungkin Anda sudah pernah melamar untuk posisi ini.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Lamar Pekerjaan</h2>
            <p className="text-sm text-gray-600 mt-1">{jobTitle} di {companyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar-modal space-y-4">
          <div>
            <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <UploadCloud size={16} className="mr-2"/> Unggah CV/Resume (PDF, Maks. 5MB) <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="resumeFile"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition file:cursor-pointer border border-gray-300 rounded-lg p-0 focus-within:ring-1 focus-within:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FileText size={16} className="mr-2"/> Cover Letter (Opsional)
            </label>
            <textarea
              id="coverLetter"
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Jelaskan mengapa Anda adalah kandidat yang tepat untuk posisi ini..."
              className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

           <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <StickyNote size={16} className="mr-2"/> Catatan Tambahan (Opsional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informasi tambahan yang ingin Anda sampaikan kepada perekrut..."
              className="w-full px-3 py-2 text-sm rounded-md bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
        </form>

        <div className="pt-5 border-t mt-auto flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Mengirim...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Kirim Lamaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
