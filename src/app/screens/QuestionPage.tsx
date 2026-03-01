import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Camera, FileText, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, MinusCircle, AlertTriangle, Info,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type AnswerType = 'OK' | 'Tidak OK' | 'N/A' | null;
type Severity = 'Rendah' | 'Sedang' | 'Tinggi' | null;

interface Question {
  id: string;
  section: string;
  text: string;
  hint?: string;
  requiresPhoto?: boolean;
}

const allQuestions: Question[] = [
  // Eksterior
  { id: 'e1', section: 'Eksterior', text: 'Apakah semua lampu eksterior berfungsi? (Depan, Belakang, Sein)', hint: 'Periksa lampu utama, rem, mundur, dan sein kanan-kiri' },
  { id: 'e2', section: 'Eksterior', text: 'Apakah kaca depan bebas dari retak atau kerusakan?', hint: 'Perhatikan area pandang langsung pengemudi', requiresPhoto: true },
  { id: 'e3', section: 'Eksterior', text: 'Apakah kondisi cat dan body kendaraan baik (tidak penyok/goresan/karat)?', requiresPhoto: true },
  { id: 'e4', section: 'Eksterior', text: 'Apakah keempat ban dalam kondisi baik dan tekanan sesuai standar?', hint: 'Tapak ban minimal 1.6mm, tidak ada benjolan' },
  { id: 'e5', section: 'Eksterior', text: 'Apakah spion kanan, kiri, dan tengah berfungsi dan tidak rusak?' },
  { id: 'e6', section: 'Eksterior', text: 'Apakah wiper depan/belakang dan washer berfungsi dengan baik?' },
  // Interior
  { id: 'i1', section: 'Interior', text: 'Apakah dashboard dan semua indikator berfungsi normal?', hint: 'Tidak ada warning light yang menyala saat mesin hidup' },
  { id: 'i2', section: 'Interior', text: 'Apakah sistem AC bekerja dan mendinginkan dengan baik?', hint: 'Uji pada semua kecepatan blower, pastikan dingin merata' },
  { id: 'i3', section: 'Interior', text: 'Apakah semua sabuk pengaman terkunci dan berfungsi dengan benar?' },
  { id: 'i4', section: 'Interior', text: 'Apakah kondisi jok, karpet, dan interior dalam keadaan bersih dan tidak rusak?', requiresPhoto: true },
  { id: 'i5', section: 'Interior', text: 'Apakah sistem audio, layar, dan fitur konektivitas (USB, Bluetooth) berfungsi?' },
  { id: 'i6', section: 'Interior', text: 'Apakah pedal gas, rem, dan kopling terasa normal (tidak berat atau selip)?' },
  // Mesin
  { id: 'm1', section: 'Mesin', text: 'Apakah mesin menyala normal dan suara halus tanpa bunyi abnormal?', hint: 'Dengarkan ketukan, derik, atau suara bising', requiresPhoto: true },
  { id: 'm2', section: 'Mesin', text: 'Apakah tidak ada kebocoran oli, air radiator, atau cairan lain di ruang mesin?', requiresPhoto: true },
  { id: 'm3', section: 'Mesin', text: 'Apakah level oli mesin, air radiator, dan minyak rem dalam kondisi cukup?' },
  { id: 'm4', section: 'Mesin', text: 'Apakah sabuk mesin (timing/alternator) dalam kondisi baik, tidak retak/longgar?' },
  { id: 'm5', section: 'Mesin', text: 'Apakah temperatur mesin stabil dan sistem pendingin berfungsi baik?' },
  // Kaki-kaki
  { id: 'k1', section: 'Kaki-kaki', text: 'Apakah sistem pengereman (depan dan belakang) berfungsi dengan efektif?', hint: 'Periksa ketebalan kampas dan cakram/tromol' },
  { id: 'k2', section: 'Kaki-kaki', text: 'Apakah tidak ada bunyi abnormal dari suspensi saat jalan tidak rata?' },
  { id: 'k3', section: 'Kaki-kaki', text: 'Apakah setir lurus dan tidak ada getaran, tarikan, atau free play berlebih?', hint: 'Uji pada kecepatan 40-60 km/h di jalan lurus' },
  { id: 'k4', section: 'Kaki-kaki', text: 'Apakah ban serep tersedia, terpasang dengan baik, dan layak pakai?' },
  { id: 'k5', section: 'Kaki-kaki', text: 'Apakah pelek (velg) tidak retak, penyok, atau terlihat berkarat parah?' },
];

interface AnswerState { answer: AnswerType; severity: Severity; note: string; }

const sectionOrder = ['Eksterior', 'Interior', 'Mesin', 'Kaki-kaki'];

const sectionMeta: Record<string, { color: string; text: string }> = {
  'Eksterior':  { color: 'bg-primary-blue/10 text-primary-blue',   text: 'text-primary-blue' },
  'Interior':   { color: 'bg-success-green/10 text-success-green', text: 'text-success-green' },
  'Mesin':      { color: 'bg-warning-amber/10 text-warning-amber', text: 'text-warning-amber' },
  'Kaki-kaki':  { color: 'bg-info-blue/10 text-info-blue',         text: 'text-info-blue' },
};

export default function QuestionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [direction, setDirection] = useState(1);

  const question = allQuestions[currentIndex];
  const current = answers[question.id] ?? { answer: null, severity: null, note: '' };
  const meta = sectionMeta[question.section] ?? { color: 'bg-neutral-100 text-muted-foreground', text: 'text-muted-foreground' };

  const answeredCount = Object.values(answers).filter((a) => a.answer !== null).length;
  const flaggedCount  = Object.values(answers).filter((a) => a.answer === 'Tidak OK').length;

  const sectionQs = allQuestions.filter((q) => q.section === question.section);
  const sectionIdx = sectionQs.findIndex((q) => q.id === question.id);

  const setAnswer = (field: Partial<AnswerState>) =>
    setAnswers((prev) => ({ ...prev, [question.id]: { ...current, ...field } }));

  const goTo = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };
  const goNext = () => currentIndex < allQuestions.length - 1 ? goTo(currentIndex + 1) : navigate(`/app/inspections/${id}`);
  const goPrev = () => currentIndex > 0 ? goTo(currentIndex - 1) : navigate(-1 as unknown as string);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goPrev}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                {question.section}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {sectionIdx + 1}/{sectionQs.length} di seksi ini
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Pertanyaan {currentIndex + 1} dari {allQuestions.length}</p>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1 text-success-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{answeredCount}</span>
            </div>
            {flaggedCount > 0 && (
              <div className="flex items-center gap-1 text-danger-red">
                <XCircle className="w-3.5 h-3.5" />
                <span>{flaggedCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section progress bars */}
        <div className="flex gap-1.5">
          {sectionOrder.map((sec) => {
            const secQs = allQuestions.filter((q) => q.section === sec);
            const done = secQs.filter((q) => answers[q.id]?.answer != null).length;
            const isActive = sec === question.section;
            const m = sectionMeta[sec];
            return (
              <div key={sec} className="flex-1">
                <div className="h-1 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      done === secQs.length ? 'bg-success-green' : isActive ? 'bg-primary-blue' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                    style={{ width: `${(done / secQs.length) * 100}%` }}
                  />
                </div>
                <p className={`text-[9px] mt-0.5 truncate ${isActive ? m.text : 'text-muted-foreground'}`}>{sec}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Question Content */}
      <div className="px-4 py-4 pb-36 space-y-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="space-y-3"
          >
            {/* Question Card */}
            <Card>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-semibold ${meta.color}`}>
                  {currentIndex + 1}
                </div>
                <h2 className="text-[15px] leading-snug flex-1">{question.text}</h2>
              </div>

              {question.hint && (
                <div className="flex items-start gap-2 mb-4 bg-info-blue/5 border border-info-blue/15 rounded-xl px-3 py-2.5">
                  <Info className="w-3.5 h-3.5 text-info-blue flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <p className="text-xs text-muted-foreground leading-relaxed">{question.hint}</p>
                </div>
              )}

              {/* Answer Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {(['OK', 'Tidak OK', 'N/A'] as AnswerType[]).map((opt) => {
                  const selected = current.answer === opt;
                  const style = {
                    'OK':       selected ? 'bg-success-green text-white border-success-green shadow-lg shadow-success-green/20' : 'border-input hover:border-success-green/50 hover:bg-success-green/5',
                    'Tidak OK': selected ? 'bg-danger-red text-white border-danger-red shadow-lg shadow-danger-red/20'         : 'border-input hover:border-danger-red/50 hover:bg-danger-red/5',
                    'N/A':      selected ? 'bg-neutral-500 text-white border-neutral-500 shadow-md'                           : 'border-input hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  }[opt!];
                  const Icon = { 'OK': CheckCircle2, 'Tidak OK': XCircle, 'N/A': MinusCircle }[opt!];
                  return (
                    <motion.button key={opt} whileTap={{ scale: 0.95 }}
                      onClick={() => setAnswer({ answer: opt, severity: opt === 'Tidak OK' ? (current.severity ?? 'Sedang') : null })}
                      className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 gap-1 ${style}`}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                      <span className="text-[12px] font-medium">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Severity + Note — when "Tidak OK" */}
            <AnimatePresence>
              {current.answer === 'Tidak OK' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                  <Card className="border-danger-red/20 bg-danger-red/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-danger-red" strokeWidth={1.8} />
                      <span className="text-[13px]">Tingkat Keparahan</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { value: 'Rendah' as Severity,  active: 'bg-info-blue    text-white', passive: 'bg-info-blue/10    text-info-blue' },
                        { value: 'Sedang' as Severity,  active: 'bg-warning-amber text-white', passive: 'bg-warning-amber/10 text-warning-amber' },
                        { value: 'Tinggi' as Severity,  active: 'bg-danger-red   text-white', passive: 'bg-danger-red/10   text-danger-red' },
                      ].map((sev) => (
                        <motion.button key={sev.value} whileTap={{ scale: 0.96 }}
                          onClick={() => setAnswer({ severity: sev.value })}
                          className={`py-2.5 rounded-xl text-[13px] font-medium transition-colors ${current.severity === sev.value ? sev.active : sev.passive}`}>
                          {sev.value}
                        </motion.button>
                      ))}
                    </div>
                    <label className="block text-[13px] mb-2">Catatan Temuan</label>
                    <textarea value={current.note} onChange={(e) => setAnswer({ note: e.target.value })}
                      placeholder="Deskripsikan masalah yang ditemukan secara detail..."
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-danger-red/15 focus:border-danger-red resize-none"
                      rows={3} />
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" fullWidth onClick={() => navigate(`/app/inspections/${id}/media`)}>
                        <Camera className="w-4 h-4 mr-1.5" strokeWidth={1.8} />Foto Bukti
                      </Button>
                      <Button variant="outline" size="sm" fullWidth onClick={() => navigate(`/app/inspections/${id}/issue`)}>
                        <FileText className="w-4 h-4 mr-1.5" strokeWidth={1.8} />Buat Isu
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo reminder */}
            {question.requiresPhoto && current.answer === 'OK' && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => navigate(`/app/inspections/${id}/media`)}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-primary-blue/40 bg-primary-blue/[0.03] text-primary-blue text-sm hover:bg-primary-blue/8 transition-colors">
                <Camera className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                <span>Disarankan: ambil foto dokumentasi</span>
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-divider/50 px-4 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 88px)' }}>
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex gap-2">
            <Button variant="secondary" size="lg" onClick={goPrev} className="w-14 flex-shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button fullWidth size="lg" onClick={goNext}>
              {currentIndex === allQuestions.length - 1 ? 'Selesai' : (
                <span className="flex items-center gap-1">Lanjut <ChevronRight className="w-4 h-4" /></span>
              )}
            </Button>
          </div>
          {current.answer === null && (
            <p className="text-center text-[11px] text-muted-foreground">
              Pilih jawaban untuk melanjutkan, atau lewati dengan tekan Lanjut
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
