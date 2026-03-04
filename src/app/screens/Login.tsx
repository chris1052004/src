import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { isLoggedIn, login } from '../lib/auth';

// ─── Validation ───────────────────────────────────────────────────────────────

interface LoginErrors {
  email?: string;
  password?: string;
}

function validateForm(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) errors.email = 'Email wajib diisi';
  else if (!emailRegex.test(email.trim())) errors.email = 'Format email tidak valid';
  if (!password) errors.password = 'Password wajib diisi';
  else if (password.length < 8) errors.password = 'Password minimal 8 karakter';
  return errors;
}

// ─── Input field ──────────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

function InputField({
  id, label, type, placeholder, value, onChange, onBlur,
  error, required = false, autoComplete, leftIcon, rightSlot,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12px] font-semibold text-muted-foreground tracking-wide uppercase">
        {label}
        {required && <span className="text-danger-red ml-1 normal-case font-normal">*</span>}
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`h-13 w-full rounded-2xl bg-surface text-foreground text-[14px] placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:bg-card focus:ring-2 focus:ring-offset-0 border ${
            leftIcon ? 'pl-11' : 'pl-4'
          } ${rightSlot ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-red-300 focus:ring-red-200 bg-red-50/40'
              : 'border-divider focus:border-primary-blue/50 focus:ring-primary-blue/15'
          }`}
        />
        {rightSlot && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-danger-red font-medium flex items-center gap-1"
        >
          <span>•</span> {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── Decorative hero background ───────────────────────────────────────────────

function HeroBg() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 320" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
      {/* Large blobs */}
      <circle cx="340" cy="40"  r="110" fill="white" opacity="0.06" />
      <circle cx="-30"  cy="280" r="120" fill="white" opacity="0.05" />
      <circle cx="195"  cy="160" r="160" fill="white" opacity="0.03" />
      {/* Ring decorations */}
      <circle cx="330" cy="55"  r="65"  stroke="white" strokeWidth="1" opacity="0.12" />
      <circle cx="330" cy="55"  r="42"  stroke="white" strokeWidth="0.7" opacity="0.09" />
      <circle cx="60"  cy="250" r="55"  stroke="white" strokeWidth="1" opacity="0.1"  />
      {/* Dot grid (subtle) */}
      {[0,1,2,3,4,5].map(row =>
        [0,1,2,3,4,5,6,7].map(col => (
          <circle key={`${row}-${col}`}
            cx={col * 52 + 14} cy={row * 52 + 20}
            r="1.5" fill="white" opacity="0.08"
          />
        ))
      )}
      {/* Diagonal accent line */}
      <line x1="0" y1="200" x2="390" y2="60" stroke="white" strokeWidth="0.6" opacity="0.08" />
      <line x1="0" y1="230" x2="390" y2="90" stroke="white" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  useEffect(() => {
    if (isLoggedIn()) navigate('/app/home', { replace: true });
  }, [navigate]);

  const errors = useMemo(() => validateForm(email, password), [email, password]);
  const showEmailError = Boolean((submitted || touched.email) && errors.email);
  const showPasswordError = Boolean((submitted || touched.password) && errors.password);
  const canSubmit = Boolean(email.trim() && password);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const formErrors = validateForm(email, password);
    if (formErrors.email || formErrors.password) return;
    setIsSubmitting(true);
    login(email.trim());
    window.setTimeout(() => navigate('/app/home', { replace: true }), 300);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-card">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 flex flex-col justify-end overflow-hidden status-bar-aware"
        style={{
          height: '44%',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #3b82f6 100%)',
        }}
      >
        <HeroBg />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 px-6 pb-10"
        >
          {/* Brand badge */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.14em]">G Tech Solutions</p>
              <p className="text-[13px] font-semibold text-white leading-tight">G Tech Auditor</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[32px] font-bold text-white leading-[1.15] tracking-tight">
            Selamat<br />Datang Kembali
          </h1>
          <p className="mt-2 text-[13px] text-white/65 leading-relaxed">
            Masuk untuk melanjutkan inspeksi Anda
          </p>
        </motion.div>
      </div>

      {/* ── Form card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.4, type: 'spring', stiffness: 280, damping: 28 }}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 28px)' }}
      >
        {/* Lift card */}
        <div className="bg-card rounded-t-[32px] -mt-6 px-6 pt-7 pb-4 shadow-[0_-8px_32px_rgba(15,23,42,0.10)] min-h-full">

          {/* Drag handle */}
          <div className="w-10 h-1 rounded-full bg-divider mx-auto mb-7" />

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={setEmail}
              onBlur={() => setTouched((c) => ({ ...c, email: true }))}
              error={showEmailError ? errors.email : undefined}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 karakter"
              value={password}
              onChange={setPassword}
              onBlur={() => setTouched((c) => ({ ...c, password: true }))}
              error={showPasswordError ? errors.password : undefined}
              required
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightSlot={
                <button
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2.5 text-[13px] text-muted-foreground select-none cursor-pointer">
                <div
                  onClick={() => setRememberMe((r) => !r)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    rememberMe ? 'bg-primary-blue border-primary-blue' : 'border-divider bg-card'
                  }`}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                Ingat saya
              </label>
              <button type="button" className="text-[13px] font-semibold text-primary-blue">
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="h-13 w-full rounded-2xl text-white text-[15px] font-bold tracking-wide shadow-lg shadow-primary-blue/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                style={{
                  background: canSubmit && !isSubmitting
                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                    : '#93c5fd',
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Masuk...
                  </span>
                ) : (
                  'Masuk'
                )}
              </button>
            </div>
          </form>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
            <p className="text-[11px] text-muted-foreground">
              Akses khusus pengguna terdaftar
            </p>
          </div>

          {/* Footer */}
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            © 2026 G Tech Solutions
          </p>
        </div>
      </motion.div>
    </div>
  );
}
