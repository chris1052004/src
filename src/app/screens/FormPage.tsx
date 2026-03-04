import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import {
  X,
  Ellipsis,
  ChevronRight,
  ChevronDown,
  FileText,
  Camera,
  Settings2,
  PenLine,
  MapPin,
  Fuel,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldAction {
  icon: typeof PenLine;
  label: string;
  desc: string;
}

const FIELD_ACTIONS: FieldAction[] = [
  { icon: PenLine,   label: 'Edit nilai',      desc: 'Ubah isi field ini'     },
  { icon: FileText,  label: 'Tambah catatan',  desc: 'Catat observasi tambahan' },
  { icon: Camera,    label: 'Tambah media',    desc: 'Foto atau rekaman video' },
  { icon: Settings2, label: 'Buat tindakan',   desc: 'Tetapkan action item'   },
];

// ─── Field Actions Sheet ──────────────────────────────────────────────────────
// Replaces the repeated "Add note / Media / Action" chip row under every field.
// Opened by tapping the ⋯ trailing icon on any field row.

function FieldActionsSheet({
  label,
  onClose,
}: {
  label: string;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(0,0,0,0.38)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 360 }}
        className="fixed bottom-0 left-0 right-0 z-[60] max-w-[480px] mx-auto rounded-t-[24px] bg-card shadow-[0_-4px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.5)]"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-divider" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-divider">
          <p className="text-[14px] font-semibold text-foreground">{label}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
          </button>
        </div>

        {/* Actions */}
        <div style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}>
          {FIELD_ACTIONS.map(({ icon: Icon, label: actionLabel, desc }, idx) => (
            <button
              key={actionLabel}
              onClick={onClose}
              className="w-full flex items-center gap-3.5 px-5 py-3.5 active:bg-surface transition-colors border-b border-divider last:border-b-0"
              style={{
                borderBottom: idx < FIELD_ACTIONS.length - 1 ? undefined : 'none',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-blue/10">
                <Icon className="w-4 h-4 text-primary-blue" strokeWidth={1.8} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[14px] font-medium text-foreground">{actionLabel}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────
// Compact 2-line row: label (top) / value or placeholder (bottom) + trailing ⋯

function FieldRow({
  label,
  value,
  placeholder = 'Ketuk untuk edit',
  required,
  disabled,
  onChange,
  onActionsOpen,
  multiline,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (v: string) => void;
  onActionsOpen: () => void;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 px-4">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Label row */}
        <div className="flex items-center gap-1 mb-0.5">
          {required && (
            <span className="text-danger-red text-[12px] leading-none font-medium">*</span>
          )}
          <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        </div>

        {/* Value / input */}
        {disabled ? (
          <p className={`text-[14px] leading-snug ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {value || placeholder}
          </p>
        ) : multiline ? (
          <textarea
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full text-[14px] bg-transparent border-none focus:outline-none resize-none leading-snug text-foreground placeholder:text-muted-foreground"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full text-[14px] bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>

      {/* ⋯ actions trigger */}
      <button
        onClick={onActionsOpen}
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 active:bg-secondary transition-colors bg-surface"
        aria-label={`Aksi untuk ${label}`}
      >
        <Ellipsis className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── SelectRow ────────────────────────────────────────────────────────────────

function SelectRow({
  label,
  value,
  onChange,
  options,
  required,
  onActionsOpen,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  onActionsOpen: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5 px-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          {required && (
            <span className="text-danger-red text-[12px] leading-none font-medium">*</span>
          )}
          <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 text-[14px] bg-transparent border-none focus:outline-none appearance-none text-foreground"
          >
            <option value="" disabled>Pilih {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 pointer-events-none" strokeWidth={2} />
        </div>
      </div>
      <button
        onClick={onActionsOpen}
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 active:bg-secondary transition-colors bg-surface"
        aria-label={`Aksi untuk ${label}`}
      >
        <Ellipsis className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── FieldGroup ───────────────────────────────────────────────────────────────
// Grouped container with a subtle section label above.

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2 px-1">
        {title}
      </p>
      <div
        className="rounded-2xl bg-card overflow-hidden divide-y divide-divider shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/[0.06]"
      >
        {children}
      </div>
    </div>
  );
}

// ─── Section progress ─────────────────────────────────────────────────────────

function SectionProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-[4px] rounded-full transition-colors ${i < current ? 'bg-primary-blue' : 'bg-secondary'}`}
        />
      ))}
    </div>
  );
}

// ─── Static option data ───────────────────────────────────────────────────────

const carBrands     = ['Toyota', 'Honda', 'Mitsubishi', 'Daihatsu', 'Suzuki', 'Nissan', 'Mazda', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Lainnya'];
const fuelTypes     = ['Bensin', 'Diesel', 'Hybrid', 'Listrik'];
const transmissions = ['Manual', 'Otomatis (AT)', 'CVT'];
const colors        = ['Putih', 'Hitam', 'Silver', 'Abu-abu', 'Merah', 'Biru', 'Coklat', 'Lainnya'];
const fuelLevels    = ['E', '1/4', '1/2', '3/4', 'F'];
const years         = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));

const fuelBarColor: Record<string, string> = {
  E: '#EF4444', '1/4': '#F59E0B', '1/2': '#F59E0B', '3/4': '#10B981', F: '#10B981',
};
const fuelPctMap: Record<string, number> = {
  E: 4, '1/4': 25, '1/2': 50, '3/4': 75, F: 100,
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Active field for the actions sheet (null = sheet closed)
  const [activeField, setActiveField] = useState<string | null>(null);

  const [vehicle, setVehicle] = useState({
    plate: '', vin: '', brand: '', model: '',
    year: '', color: '', odometer: '', fuel: '',
    transmission: '', fuelLevel: '3/4',
  });
  const [inspection, setInspection] = useState({
    dealerName: '',
    dealerCode: '',
    preparedBy: 'Muhammad Faisal',
    location: '',
    date: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} pukul ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
  });

  const fuelPct = fuelPctMap[vehicle.fuelLevel] ?? 75;

  function open(label: string) {
    setActiveField(label);
  }

  return (
    <div className="bg-surface" style={{ minHeight: '100%', fontFamily: 'inherit' }}>

      {/* ══ Sticky App Bar ══════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-40 status-bar-aware bg-card border-b border-divider shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:shadow-none"
      >
        <div className="flex items-center px-4 h-12 gap-2">
          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-foreground" strokeWidth={2.2} />
          </motion.button>

          {/* Centered title */}
          <div className="flex-1 text-center">
            <p className="text-[15px] font-semibold text-foreground leading-tight">Title Page</p>
            <p className="text-[11px] text-muted-foreground mt-[-1px]">Page 1 / 21</p>
          </div>

          {/* Overflow */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface"
            aria-label="Menu lainnya"
          >
            <Ellipsis className="w-4 h-4 text-foreground" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* ══ Scrollable Content ══════════════════════════════════════════════ */}
      {/* pb accounts for bottom bar height (~96px) + bottom nav (56px) */}
      <div
        className="px-4 pt-4 space-y-5"
        style={{ paddingBottom: 'calc(152px + env(safe-area-inset-bottom))' }}
      >

        {/* ── Informasi Inspeksi ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.04 }}
        >
          <FieldGroup title="Informasi Inspeksi">
            <FieldRow
              label="Name Dealer"
              value={inspection.dealerName}
              required
              onChange={v => setInspection({ ...inspection, dealerName: v })}
              onActionsOpen={() => open('Name Dealer')}
            />
            <FieldRow
              label="Code Dealer"
              value={inspection.dealerCode}
              onChange={v => setInspection({ ...inspection, dealerCode: v })}
              onActionsOpen={() => open('Code Dealer')}
            />
            <FieldRow
              label="Prepared by"
              value={inspection.preparedBy}
              disabled
              onActionsOpen={() => open('Prepared by')}
            />
            <FieldRow
              label="Tanggal"
              value={inspection.date}
              disabled
              onActionsOpen={() => open('Tanggal')}
            />
            {/* Location row with GPS shortcut */}
            <div className="px-4 py-3.5 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-danger-red text-[12px] leading-none font-medium">*</span>
                  <span className="text-[12px] font-medium text-muted-foreground">Location</span>
                </div>
                <input
                  type="text"
                  value={inspection.location}
                  onChange={e => setInspection({ ...inspection, location: e.target.value })}
                  placeholder="Ketuk untuk edit"
                  className="w-full text-[14px] bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-primary-blue">
                  <MapPin className="w-3 h-3" strokeWidth={2.2} />
                  Gunakan lokasi saat ini
                </button>
              </div>
              <button
                onClick={() => open('Location')}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 active:bg-secondary transition-colors bg-surface"
                aria-label="Aksi untuk Location"
              >
                <Ellipsis className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
              </button>
            </div>
          </FieldGroup>
        </motion.div>

        {/* ── Data Kendaraan ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.10 }}
        >
          <FieldGroup title="Data Kendaraan">
            {/* License plate — big monospace input */}
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-danger-red text-[12px] leading-none font-medium">*</span>
                <span className="text-[12px] font-medium text-muted-foreground">No. Polisi</span>
              </div>
              <input
                type="text"
                placeholder="B 1234 ABC"
                value={vehicle.plate}
                onChange={e => setVehicle({ ...vehicle, plate: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 rounded-xl text-center tracking-[0.22em] font-bold text-[16px] uppercase text-foreground focus:outline-none bg-surface border border-divider"
                style={{
                  fontFamily: 'monospace',
                }}
              />
            </div>
            <SelectRow label="Merek"       value={vehicle.brand}        onChange={v => setVehicle({ ...vehicle, brand: v })}        options={carBrands}    required onActionsOpen={() => open('Merek')}       />
            <FieldRow  label="Model"       value={vehicle.model}        onChange={v => setVehicle({ ...vehicle, model: v })}        placeholder="Avanza, CR-V..." required onActionsOpen={() => open('Model')}       />
            <SelectRow label="Tahun"       value={vehicle.year}         onChange={v => setVehicle({ ...vehicle, year: v })}         options={years}        required onActionsOpen={() => open('Tahun')}       />
            <SelectRow label="Warna"       value={vehicle.color}        onChange={v => setVehicle({ ...vehicle, color: v })}        options={colors}               onActionsOpen={() => open('Warna')}       />
            <SelectRow label="Bahan Bakar" value={vehicle.fuel}         onChange={v => setVehicle({ ...vehicle, fuel: v })}         options={fuelTypes}            onActionsOpen={() => open('Bahan Bakar')} />
            <SelectRow label="Transmisi"   value={vehicle.transmission} onChange={v => setVehicle({ ...vehicle, transmission: v })} options={transmissions}         onActionsOpen={() => open('Transmisi')}   />
            <FieldRow  label="No. Rangka (VIN)" value={vehicle.vin}    onChange={v => setVehicle({ ...vehicle, vin: v.toUpperCase() })} placeholder="MHKF1GH3..." onActionsOpen={() => open('No. Rangka')} />
          </FieldGroup>
        </motion.div>

        {/* ── Kondisi Saat Inspeksi ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.16 }}
        >
          <FieldGroup title="Kondisi Saat Inspeksi">
            <FieldRow
              label="Odometer (KM)"
              value={vehicle.odometer}
              onChange={v => setVehicle({ ...vehicle, odometer: v })}
              placeholder="45.000"
              required
              onActionsOpen={() => open('Odometer')}
            />

            {/* Fuel level — inline segmented selector */}
            <div className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] font-medium text-muted-foreground">Level BBM</span>
                <button
                  onClick={() => open('Level BBM')}
                  className="w-7 h-7 rounded-lg flex items-center justify-center active:bg-secondary transition-colors bg-surface"
                  aria-label="Aksi untuk Level BBM"
                >
                  <Ellipsis className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>

              {/* Level buttons */}
              <div className="flex gap-1.5 mb-2.5">
                {fuelLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setVehicle({ ...vehicle, fuelLevel: level })}
                    className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95"
                    style={{
                      background: vehicle.fuelLevel === level ? '#2563EB' : undefined,
                      color:      vehicle.fuelLevel === level ? '#FFFFFF' : undefined,
                    }}
                    {...(vehicle.fuelLevel !== level ? { className: 'flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95 bg-secondary text-muted-foreground' } : {})}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Bar */}
              <div className="flex items-center gap-2.5">
                <Fuel className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-secondary">
                  <motion.div
                    animate={{ width: `${fuelPct}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: fuelBarColor[vehicle.fuelLevel] }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground w-6 text-right tabular-nums">
                  {vehicle.fuelLevel}
                </span>
              </div>
            </div>
          </FieldGroup>
        </motion.div>
      </div>

      {/* ══ Sticky Bottom Bar — sits directly above BottomNav (56px) ════════ */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="fixed left-0 right-0 z-40 max-w-[480px] mx-auto bg-card px-4 pt-3 border-t border-divider shadow-[0_-2px_16px_rgba(0,0,0,0.06)] dark:shadow-none"
        style={{
          bottom: '56px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        }}
      >
        {/* Progress meta */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-muted-foreground">Seksi 1 dari 5 — Data Kendaraan</span>
        </div>
        <SectionProgress current={1} total={5} />

        {/* Buttons */}
        <div className="flex gap-3 mt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="h-12 px-5 rounded-2xl text-[14px] font-semibold flex-shrink-0 bg-secondary text-foreground"
          >
            Kembali
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/inspections/${id}/questions`)}
            className="relative flex-1 h-12 rounded-2xl text-[15px] font-bold text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 2px 10px rgba(37,99,235,0.30)',
            }}
          >
            Berikutnya →
            <span className="absolute inset-0 pointer-events-none shimmer-slide" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>

      {/* ══ Field Actions Sheet ════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeField && (
          <FieldActionsSheet
            label={activeField}
            onClose={() => setActiveField(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
