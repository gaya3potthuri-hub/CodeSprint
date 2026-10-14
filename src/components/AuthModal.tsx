import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle,
  Eye, 
  EyeOff, 
  KeyRound,
  Sparkles,
  GraduationCap,
  Briefcase,
  Compass,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundFx } from '../services/soundFx';
import { authService, UserDesignation } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  defaultMode?: 'login' | 'register';
}

type ModalTab = 'login' | 'register' | 'verify' | 'forgot';

const DESIGNATION_OPTIONS: { id: UserDesignation; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'School Student', label: 'School Student', desc: 'Building algorithmic logic fundamentals', icon: <GraduationCap className="w-4 h-4 text-green" /> },
  { id: 'College Student', label: 'College Student', desc: 'Computer science & developer preparation', icon: <GraduationCap className="w-4 h-4 text-purple" /> },
  { id: 'Working Professional', label: 'Working Professional', desc: 'Specializing for engineering excellence', icon: <Briefcase className="w-4 h-4 text-gold" /> },
  { id: 'Self-Learner', label: 'Self-Learner', desc: 'Independent builder mastering code', icon: <Compass className="w-4 h-4 text-green" /> },
  { id: 'Other', label: 'Other', desc: 'Curious explorer of computational systems', icon: <HelpCircle className="w-4 h-4 text-red" /> }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultMode = 'login'
}) => {
  const [tab, setTab] = useState<ModalTab>(defaultMode);

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conversational Register states
  const [regStep, setRegStep] = useState(1);
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regDesignation, setRegDesignation] = useState<UserDesignation>('College Student');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regError, setRegError] = useState('');

  // Verification states
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');

  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotActiveCode, setForgotActiveCode] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  if (!isOpen) return null;

  const playHover = () => soundFx.hoverTick();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    soundFx.lockIn();

    try {
      const res = await authService.login(loginEmail, loginPassword);
      if (!res.success) {
        setIsSubmitting(false);
        soundFx.errorDeflect();
        if (res.requiresVerification && res.account) {
          setVerifyEmail(res.account.email);
          setActiveCode(res.account.verificationCode || null);
          setTab('verify');
          setVerifyError('Please enter your 6-digit verification code.');
        } else {
          setLoginError(res.error || 'Authentication failed.');
        }
        return;
      }

      if (res.account) {
        soundFx.rankUp();
        const userProf: UserProfile = {
          id: res.account.id,
          name: res.account.displayName,
          callsign: res.account.displayName.toUpperCase(),
          username: res.account.email.split('@')[0],
          email: res.account.email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          rankTier: 'Gold',
          level: 3,
          xp: 1850,
          xpToNextLevel: 150,
          streak: 5,
          headshotAccuracy: 94.2,
          totalMatchesWon: 28,
          completedChallengeIds: ['py-ch-1', 'py-ch-2', 'py-ch-4', 'sql-ch-1', 'web-ch-1'],
          joinedDate: 'October 2026',
          dailyGoalXp: 100,
          soundEnabled: true,
          theme: 'tactical',
          primaryPath: 'python'
        };

        setTimeout(() => {
          onLoginSuccess(userProf);
          onClose();
        }, 500);
      }
    } catch {
      setIsSubmitting(false);
      setLoginError('An unexpected authentication error occurred.');
    }
  };

  const handleRegNext = () => {
    soundFx.click();
    setRegError('');

    if (regStep === 1) {
      if (!regDisplayName.trim()) {
        setRegError('Please provide your name or callsign.');
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      setRegStep(3);
    } else if (regStep === 3) {
      if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
        setRegError('Please enter a valid email address.');
        return;
      }
      if (authService.findAccountByEmail(regEmail)) {
        setRegError(`An account with email "${regEmail}" already exists. Please log in.`);
        return;
      }
      setRegStep(4);
    } else if (regStep === 4) {
      if (regPassword.length < 8) {
        setRegError('Secret key must be at least 8 characters long.');
        return;
      }
      setRegStep(5);
    } else if (regStep === 5) {
      handleCompleteRegister();
    }
  };

  const handleCompleteRegister = async () => {
    if (regPassword !== regConfirmPassword) {
      soundFx.errorDeflect();
      setRegError('Secret keys do not match.');
      return;
    }

    setIsSubmitting(true);
    soundFx.lockIn();

    try {
      const res = await authService.register(
        regDisplayName,
        regDesignation,
        regEmail,
        regPassword
      );

      setIsSubmitting(false);

      if (!res.success) {
        soundFx.errorDeflect();
        setRegError(res.error || 'Registration failed.');
        return;
      }

      soundFx.rankUp();
      setVerifyEmail(regEmail);
      setActiveCode(res.verificationCode || null);
      setTab('verify');
      setVerifySuccess(`Verification code dispatched to ${regEmail}!`);
    } catch {
      setIsSubmitting(false);
      setRegError('Failed to create account.');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click();
    setVerifyError('');

    const res = authService.verifyEmail(verifyEmail, verifyCode);
    if (!res.success) {
      soundFx.errorDeflect();
      setVerifyError(res.error || 'Invalid verification code.');
      return;
    }

    soundFx.rankUp();
    setVerifySuccess('Email verified! Logging in...');

    const userProf: UserProfile = {
      id: res.account!.id,
      name: res.account!.displayName,
      callsign: res.account!.displayName.toUpperCase(),
      username: res.account!.email.split('@')[0],
      email: res.account!.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rankTier: 'Bronze',
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      streak: 1,
      headshotAccuracy: 100,
      totalMatchesWon: 0,
      completedChallengeIds: [],
      joinedDate: 'Today',
      dailyGoalXp: 100,
      soundEnabled: true,
      theme: 'tactical',
      primaryPath: 'python'
    };

    setTimeout(() => {
      onLoginSuccess(userProf);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border-2 border-border overflow-hidden z-10 text-navy p-6 sm:p-7"
        >
          {/* Top Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green via-purple to-gold" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple border-2 border-purple-dark flex items-center justify-center text-white shadow-[0_2px_0_var(--game-purple-dark)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy font-heading">
                  CodeSprint Authentication
                </h2>
                <div className="text-xs text-muted">
                  Your Learning Passport
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="p-1.5 rounded-xl border-2 border-border text-muted hover:text-navy hover:bg-card-subtle transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-card-subtle rounded-xl border-2 border-border mb-5">
            <button
              type="button"
              onClick={() => {
                soundFx.click();
                setTab('login');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-green text-white shadow-[0_2px_0_var(--game-green-dark)]'
                  : 'text-muted hover:text-navy'
              }`}
            >
              Explorer Login
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.click();
                setTab('register');
                setRegStep(1);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-purple text-white shadow-[0_2px_0_var(--game-purple-dark)]'
                  : 'text-muted hover:text-navy'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* ======================= LOGIN TAB ======================= */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red/15 border-2 border-red/40 rounded-xl text-red text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="explorer@codesprint.gg"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-navy">
                    Secret Key (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-xs text-purple hover:underline cursor-pointer font-bold"
                  >
                    Forgot secret key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={playHover}
                className="game-btn game-btn-purple w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Enter the Realm'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================= REGISTRATION TAB ======================= */}
          {tab === 'register' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-muted font-heading">
                <span className="text-purple">STEP {regStep} OF 5</span>
                <span>{Math.round((regStep / 5) * 100)}%</span>
              </div>

              {regError && (
                <div className="p-2.5 bg-red/15 border-2 border-red/40 rounded-xl text-red text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regStep === 1 && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-navy font-heading">What should we call you?</h3>
                  <p className="text-xs text-muted">Enter your explorer display name or callsign.</p>
                  <input
                    type="text"
                    autoFocus
                    value={regDisplayName}
                    onChange={(e) => setRegDisplayName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3.5 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none"
                  />
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-navy font-heading">What best describes you?</h3>
                  <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {DESIGNATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRegDesignation(opt.id)}
                        className={`p-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer text-xs ${
                          regDesignation === opt.id
                            ? 'bg-purple/10 border-purple text-navy shadow-[0_2px_0_var(--game-purple-dark)]'
                            : 'bg-card border-border text-navy'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {opt.icon}
                          <span className="font-bold">{opt.label}</span>
                        </div>
                        {regDesignation === opt.id && <CheckCircle2 className="w-4 h-4 text-purple" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-navy font-heading">Where can we reach you?</h3>
                  <p className="text-xs text-muted">Enter your primary email address for logins.</p>
                  <input
                    type="email"
                    autoFocus
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="explorer@codesprint.gg"
                    className="w-full px-3.5 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none"
                  />
                </div>
              )}

              {regStep === 4 && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-navy font-heading">Create your secret key</h3>
                  <p className="text-xs text-muted">Minimum 8 characters. Never stored in plain-text.</p>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      autoFocus
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {regStep === 5 && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-navy font-heading">One more time!</h3>
                  <p className="text-xs text-muted">Confirm your secret key.</p>
                  <div className="relative">
                    <input
                      type={showRegConfirm ? 'text' : 'password'}
                      autoFocus
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat your secret key"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-card-subtle border-2 border-border focus:border-purple rounded-xl text-navy text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                    >
                      {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                {regStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setRegStep(regStep - 1)}
                    className="game-btn game-btn-card py-2.5 px-3 rounded-xl cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRegNext}
                  disabled={isSubmitting}
                  className="game-btn game-btn-purple flex-1 py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{regStep === 5 ? (isSubmitting ? 'Registering...' : 'Complete & Verify') : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================= VERIFICATION TAB ======================= */}
          {tab === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-navy font-heading">Verify Your Email</h3>
                <p className="text-xs text-muted">Enter the 6-digit code sent to {verifyEmail}.</p>
              </div>

              {activeCode && (
                <div className="p-3 bg-card-subtle border-2 border-green/40 rounded-xl text-xs space-y-1">
                  <div className="text-green font-bold text-xs">SIMULATED CODE</div>
                  <div className="font-mono text-base font-bold text-navy">{activeCode}</div>
                </div>
              )}

              {verifyError && (
                <div className="p-2.5 bg-red/15 border-2 border-red/40 rounded-xl text-red text-xs font-bold">
                  {verifyError}
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy outline-none font-bold"
              />

              <button
                type="submit"
                disabled={verifyCode.length < 6}
                className="game-btn game-btn-green w-full py-2.5 text-xs font-bold cursor-pointer"
              >
                Confirm Verification
              </button>
            </form>
          )}

          {/* ======================= FORGOT PASSWORD TAB ======================= */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-navy font-heading">Recover Secret Key</h3>
                <p className="text-xs text-muted">Enter registered email for a reset code.</p>
              </div>

              {forgotActiveCode && (
                <div className="p-2.5 bg-card-subtle border-2 border-gold/40 rounded-xl text-xs space-y-1">
                  <div className="text-gold font-bold text-xs">RECOVERY CODE</div>
                  <div className="text-navy font-mono font-bold text-base">{forgotActiveCode}</div>
                </div>
              )}

              {forgotError && (
                <div className="p-2.5 bg-red/15 border-2 border-red/40 rounded-xl text-red text-xs font-bold">
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="p-2.5 bg-green/15 border-2 border-green/40 rounded-xl text-green text-xs font-bold">
                  {forgotSuccess}
                </div>
              )}

              {forgotStep === 'request' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotError('');
                    const res = authService.requestPasswordReset(forgotEmail);
                    if (!res.success) {
                      setForgotError(res.error || 'Account not found.');
                      return;
                    }
                    setForgotActiveCode(res.resetCode || null);
                    setForgotStep('reset');
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="explorer@codesprint.gg"
                    required
                    className="w-full px-3.5 py-2.5 bg-card-subtle border-2 border-border focus:border-gold rounded-xl text-navy text-xs outline-none"
                  />
                  <button
                    type="submit"
                    className="game-btn game-btn-gold w-full py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Send Recovery Code
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotError('');
                    const res = await authService.resetPassword(forgotEmail, forgotCode, forgotNewPassword);
                    if (!res.success) {
                      setForgotError(res.error || 'Reset failed.');
                      return;
                    }
                    setForgotSuccess('Secret key reset! Returning to login...');
                    setTimeout(() => {
                      setLoginEmail(forgotEmail);
                      setTab('login');
                      setForgotStep('request');
                      setForgotSuccess('');
                    }, 1200);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    required
                    className="w-full text-center font-mono py-2 bg-card-subtle border-2 border-border rounded-xl text-navy text-xs outline-none font-bold"
                  />
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="New secret key (8+ chars)"
                    required
                    className="w-full px-3.5 py-2.5 bg-card-subtle border-2 border-border rounded-xl text-navy text-xs outline-none"
                  />
                  <button
                    type="submit"
                    className="game-btn game-btn-green w-full py-2.5 text-xs font-bold cursor-pointer"
                  >
                    Update Key
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-purple hover:underline cursor-pointer font-bold"
                >
                  Return to Login
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
