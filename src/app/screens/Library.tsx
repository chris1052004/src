import { useNavigate } from 'react-router';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function Library() {
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-full">
      <div className="status-bar-aware px-4 pb-3 border-b border-neutral-200 bg-white flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-neutral-700" strokeWidth={2} />
        </button>
        <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">Library</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-teal-400" strokeWidth={1.5} />
        </div>
        <p className="text-[15px] font-semibold text-neutral-800">Belum tersedia</p>
        <p className="text-[13px] text-neutral-400 mt-1.5 leading-relaxed">Fitur Library akan hadir dalam pembaruan berikutnya.</p>
      </div>
    </div>
  );
}
