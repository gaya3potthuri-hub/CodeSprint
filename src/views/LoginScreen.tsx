import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
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
  GraduationCap,
  Briefcase,
  Compass,
  HelpCircle,
  RefreshCw,
  Info,
  Compass as WorldIcon
} from 'lucide-react';
import { authService, UserDesignation } from '../services/authService';
import { soundFx } from '../services/soundFx';

interface LoginScreenProps {
  onLoginSuccess: (callsign: string, email: string, additional?: { name?: string; designation?: string }) => void;
  onExploreWithoutLogin: () => void;
}

type AuthTab = 'login' | 'register' | 'forgot' | 'verify';

const DESIGNATION_OPTIONS: { id: UserDesignation; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'School Student', label: 'School Student', desc: 'Starting your adventure into computer science', icon: <GraduationCap className="w-4 h-4 text-green" /> },
  { id: 'College Student', label: 'College Student', desc: 'Preparing for technical engineering careers', icon: <GraduationCap className="w-4 h-4 text-purple" /> },
  { id: 'Working Professional', label: 'Working Professional', desc: 'Upskilling algorithms and system mastery', icon: <Briefcase className="w-4 h-4 text-gold" /> },
  { id: 'Self-Learner', label: 'Self-Learner', desc: 'Independent builder mastering code by curiosity', icon: <Compass className="w-4 h-4 text-green" /> },
  { id: 'Other', label: 'Other', desc: 'Enthusiast exploring computational worlds', icon: <HelpCircle className="w-4 h-4 text-red" /> }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onExploreWithoutLogin
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conversational Register Form States (5 distinct questions)
  const [registerStep, setRegisterStep] = useState<number>(1);
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regDesignation, setRegDesignation] = useState<UserDesignation>('College Student');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regError, setRegError] = useState('');

  // Email Verification States
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [activeVerificationCode, setActiveVerificationCode] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccessMsg, setVerifySuccessMsg] = useState('');

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [activeResetCode, setActiveResetCode] = useState<string | null>(null);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Firebase status banner check
  const firebaseStatus = authService.checkFirebaseStatus();
  const [showFirebaseInfo, setShowFirebaseInfo] = useState(false);

  // Password strength
  const passStrength = authService.evaluatePasswordStrength(regPassword);

  // Sound helper
  const playHover = () => soundFx.hoverTick();

  // Reset errors on tab change
  const switchTab = (tab: AuthTab) => {
    soundFx.click();
    setActiveTab(tab);
    setLoginError('');
    setRegError('');
    setVerifyError('');
    setForgotError('');
    setForgotSuccess('');
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
          setActiveVerificationCode(res.account.verificationCode || null);
          setActiveTab('verify');
          setVerifyError('Please enter your 6-digit verification code to complete activation.');
        } else {
          setLoginError(res.error || 'Login failed. Please verify your credentials.');
        }
        return;
      }

      if (res.account) {
        soundFx.rankUp();
        setTimeout(() => {
          onLoginSuccess(
            res.account!.displayName.toUpperCase(),
            res.account!.email,
            { name: res.account!.displayName, designation: res.account!.designation }
          );
        }, 500);
      }
    } catch {
      setIsSubmitting(false);
      setLoginError('An unexpected authentication error occurred.');
    }
  };

  // Handle Conversational Step Next
  const handleStepNext = () => {
    soundFx.click();
    setRegError('');

    if (registerStep === 1) {
      if (!regDisplayName.trim()) {
        setRegError('Please provide a name or callsign to continue.');
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      setRegisterStep(3);
    } else if (registerStep === 3) {
      if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
        setRegError('Please enter a valid email address.');
        return;
      }
      const existing = authService.findAccountByEmail(regEmail);
      if (existing) {
        setRegError(`An account with email "${regEmail}" already exists. Please log in.`);
        return;
      }
      setRegisterStep(4);
    } else if (registerStep === 4) {
      if (regPassword.length < 8) {
        setRegError('Secret key must be at least 8 characters long.');
        return;
      }
      setRegisterStep(5);
    } else if (registerStep === 5) {
      handleCompleteRegistration();
    }
  };

  // Handle Register Complete
  const handleCompleteRegistration = async () => {
    if (regPassword !== regConfirmPassword) {
      soundFx.errorDeflect();
      setRegError('Secret keys do not match. Please re-enter confirmation.');
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
      setActiveVerificationCode(res.verificationCode || null);
      setActiveTab('verify');
      setVerifySuccessMsg(`Account created for ${regDisplayName}! Verification code dispatched.`);
    } catch {
      setIsSubmitting(false);
      setRegError('An error occurred while creating your account.');
    }
  };

  // Handle Verification Code Submit
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click();
    setVerifyError('');

    const res = authService.verifyEmail(verifyEmail, verifyCode);
    if (!res.success) {
      soundFx.errorDeflect();
      setVerifyError(res.error || 'Verification code invalid.');
      return;
    }

    soundFx.rankUp();
    setVerifySuccessMsg('Email verified successfully! Entering CodeSprint Isles...');
    setTimeout(() => {
      onLoginSuccess(
        res.account!.displayName.toUpperCase(),
        res.account!.email,
        { name: res.account!.displayName, designation: res.account!.designation }
      );
    }, 700);
  };

  // Resend Verification Code
  const handleResendCode = () => {
    soundFx.click();
    const res = authService.resendVerificationCode(verifyEmail);
    if (res.success) {
      setActiveVerificationCode(res.code || null);
      setVerifySuccessMsg('New verification code dispatched!');
    }
  };

  // Forgot Password step 1: Request Code
  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click();
    setForgotError('');

    const res = authService.requestPasswordReset(forgotEmail);
    if (!res.success) {
      soundFx.errorDeflect();
      setForgotError(res.error || 'Account not found.');
      return;
    }

    soundFx.lockIn();
    setActiveResetCode(res.resetCode || null);
    setForgotStep('reset');
    setForgotSuccess(`Reset key sent to ${forgotEmail}. Enter the code below.`);
  };

  // Forgot Password step 2: Reset Password
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.click();
    setForgotError('');

    const res = await authService.resetPassword(forgotEmail, forgotCode, forgotNewPassword);
    if (!res.success) {
      soundFx.errorDeflect();
      setForgotError(res.error || 'Reset failed.');
      return;
    }

    soundFx.rankUp();
    setForgotSuccess('Your secret key has been updated successfully! Please log in.');
    setTimeout(() => {
      setLoginEmail(forgotEmail);
      setLoginPassword('');
      setActiveTab('login');
      setForgotStep('email');
      setForgotSuccess('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-page text-navy flex flex-col justify-between font-sans select-none relative overflow-hidden">
      
      {/* Cartoon Atmosphere: Floating cloud accents & soft decorative shapes */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky/15 via-transparent to-purple/10 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/40 blur-2xl pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-sky/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[500px] h-[300px] rounded-full bg-purple/10 blur-2xl pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-5 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green flex items-center justify-center text-white border-2 border-border game-card shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-heading font-black tracking-wider text-navy uppercase">
              CODE<span className="text-green">SPRINT</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-card-subtle text-purple border-2 border-border">
              World of Coding
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <button
            onClick={() => setShowFirebaseInfo(!showFirebaseInfo)}
            onMouseEnter={playHover}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card hover:bg-card-subtle border-2 border-border text-xs font-heading font-bold text-navy transition-all cursor-pointer shadow-sm"
            title="Authentication System Status"
          >
            <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-text-muted">Auth:</span>
            <span className="font-bold text-navy">Secure Vault</span>
            <Info className="w-3.5 h-3.5 text-text-muted" />
          </button>

          <button
            onClick={() => {
              soundFx.click();
              onExploreWithoutLogin();
            }}
            onMouseEnter={playHover}
            className="game-btn game-btn-card px-4 py-2 text-xs font-heading font-bold text-navy"
          >
            <WorldIcon className="w-4 h-4 text-purple mr-1.5" />
            <span>Preview World</span>
          </button>
        </div>
      </header>

      {/* Status Details Flyout */}
      <AnimatePresence>
        {showFirebaseInfo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-xl mx-auto w-full px-6 z-30"
          >
            <div className="bg-card border-2 border-border rounded-2xl p-4 text-xs text-navy game-card space-y-2">
              <div className="flex items-center justify-between text-purple font-heading font-bold">
                <span>AUTHENTICATION ARCHITECTURE</span>
                <button
                  onClick={() => setShowFirebaseInfo(false)}
                  className="text-text-muted hover:text-navy cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {firebaseStatus.statusMessage}
              </p>
              <p className="text-text-muted text-[11px] leading-relaxed border-t-2 border-border pt-2">
                {firebaseStatus.setupInstructions}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN AUTHENTICATION CARD */}
      <main className="max-w-xl w-full mx-auto my-auto px-4 py-6 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card rounded-2xl border-2 border-border game-card p-6 sm:p-8 relative overflow-hidden text-navy"
        >
          {/* TAB NAVIGATION: LOGIN vs REGISTRATION */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-border">
            <div className="flex items-center gap-2 p-1.5 bg-card-subtle rounded-2xl border-2 border-border w-full sm:w-auto">
              <button
                type="button"
                onClick={() => switchTab('login')}
                onMouseEnter={playHover}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'game-btn game-btn-green text-white'
                    : 'text-text-secondary hover:text-navy'
                }`}
              >
                Explorer Login
              </button>

              <button
                type="button"
                onClick={() => {
                  switchTab('register');
                  setRegisterStep(1);
                }}
                onMouseEnter={playHover}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'game-btn game-btn-purple text-white'
                    : 'text-text-secondary hover:text-navy'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>New Registration</span>
              </button>
            </div>

            {activeTab === 'verify' && (
              <span className="hidden sm:inline-flex text-[11px] font-mono text-purple bg-purple/10 px-3 py-1 rounded-full border-2 border-purple/30 font-bold">
                Email Verification
              </span>
            )}
          </div>

          {/* VIEW 1: EXPLORER LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-heading font-extrabold text-navy tracking-tight">
                  Welcome back, Explorer
                </h1>
                <p className="text-xs text-text-secondary mt-1">
                  Enter your registered email and secret key to resume your journey.
                </p>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red/10 border-2 border-red/30 text-red text-xs flex items-start gap-2.5 leading-relaxed font-bold"
                >
                  <AlertCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                  <div>{loginError}</div>
                </motion.div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5 font-heading">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="explorer@codesprint.gg"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-sm outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-navy font-heading">
                      Secret Key (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => switchTab('forgot')}
                      className="text-xs text-purple font-bold hover:underline cursor-pointer"
                    >
                      Forgot secret key?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-sm outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                  className="w-full py-3.5 px-4 rounded-xl game-btn game-btn-green text-white font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{isSubmitting ? 'Verifying Credentials...' : 'Enter the World of Coding'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Registration Link */}
              <div className="pt-2 text-center text-xs text-text-secondary">
                <span>New to CodeSprint? </span>
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="text-green font-bold hover:underline cursor-pointer"
                >
                  Create an explorer account
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: CONVERSATIONAL FRIENDLY REGISTRATION (5 QUESTIONS) */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              {/* Stepper Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-heading font-bold text-text-secondary">
                  <span className="text-purple font-black">QUESTION {registerStep} OF 5</span>
                  <span>{Math.round((registerStep / 5) * 100)}% COMPLETE</span>
                </div>
                <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                  <div
                    className="h-full bg-purple transition-all duration-300 rounded-full"
                    style={{ width: `${(registerStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {regError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red/10 border-2 border-red/30 text-red text-xs flex items-start gap-2.5 leading-relaxed font-bold"
                >
                  <AlertCircle className="w-4 h-4 text-red shrink-0 mt-0.5" />
                  <div>{regError}</div>
                </motion.div>
              )}

              {/* Step 1: Display Name */}
              {registerStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-green tracking-widest uppercase font-bold">
                      STEP 1 · IDENTITY
                    </span>
                    <h2 className="text-2xl font-heading font-black text-navy mt-1">
                      What should we call you?
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Enter your explorer display name or chosen callsign.
                    </p>
                  </div>

                  <div className="relative">
                    <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      value={regDisplayName}
                      onChange={(e) => setRegDisplayName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStepNext()}
                      placeholder="e.g. Maya Chen or CyberVortex"
                      className="w-full pl-10 pr-4 py-3.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-base outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                  </div>

                  <p className="text-[11px] text-text-muted">
                    This callsign will appear on leaderboards, island beacons, and certificates.
                  </p>
                </motion.div>
              )}

              {/* Step 2: Designation */}
              {registerStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-purple tracking-widest uppercase font-bold">
                      STEP 2 · SPECIALIZATION
                    </span>
                    <h2 className="text-2xl font-heading font-black text-navy mt-1">
                      What best describes you?
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Select your current learning background to personalize village challenges.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {DESIGNATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          soundFx.click();
                          setRegDesignation(opt.id);
                        }}
                        onMouseEnter={playHover}
                        className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                          regDesignation === opt.id
                            ? 'bg-purple/10 border-purple text-navy ring-2 ring-purple/20'
                            : 'bg-card-subtle border-border text-navy hover:border-purple/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-card border-2 border-border">
                            {opt.icon}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-navy font-heading">{opt.label}</div>
                            <div className="text-[11px] text-text-secondary">{opt.desc}</div>
                          </div>
                        </div>
                        {regDesignation === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-purple" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Email */}
              {registerStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-green tracking-widest uppercase font-bold">
                      STEP 3 · CONTACT
                    </span>
                    <h2 className="text-2xl font-heading font-black text-navy mt-1">
                      Where can we reach you?
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Your registered email will be used for logins, rank verification, and security.
                    </p>
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      autoFocus
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStepNext()}
                      placeholder="alex.chen@domain.com"
                      className="w-full pl-10 pr-4 py-3.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-base outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                  </div>

                  <p className="text-[11px] text-text-muted">
                    Duplicate emails are strictly guarded. A 6-digit confirmation code will be required.
                  </p>
                </motion.div>
              )}

              {/* Step 4: Password */}
              {registerStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-gold tracking-widest uppercase font-bold">
                      STEP 4 · VAULT KEY
                    </span>
                    <h2 className="text-2xl font-heading font-black text-navy mt-1">
                      Create your secret key
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Minimum 8 characters. Passwords are never stored in plain-text.
                    </p>
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      autoFocus
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStepNext()}
                      placeholder="Create a strong secret key"
                      className="w-full pl-10 pr-10 py-3.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-base outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {regPassword.length > 0 && (
                    <div className="space-y-2 p-3 bg-card-subtle rounded-xl border-2 border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Strength:</span>
                        <span className="font-bold font-mono text-navy">
                          {passStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-2">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full transition-all ${
                              step <= passStrength.score ? 'bg-green' : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-text-muted">
                        <span className={passStrength.hasLength ? 'text-green font-bold' : ''}>
                          {passStrength.hasLength ? '✓' : '•'} 8+ chars
                        </span>
                        <span className={passStrength.hasLetter ? 'text-green font-bold' : ''}>
                          {passStrength.hasLetter ? '✓' : '•'} Letters
                        </span>
                        <span className={passStrength.hasNumber ? 'text-green font-bold' : ''}>
                          {passStrength.hasNumber ? '✓' : '•'} Numbers
                        </span>
                        <span className={passStrength.hasSpecial ? 'text-green font-bold' : ''}>
                          {passStrength.hasSpecial ? '✓' : '•'} Symbols
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Confirm Password */}
              {registerStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[11px] font-mono text-green tracking-widest uppercase font-bold">
                      STEP 5 · CONFIRMATION
                    </span>
                    <h2 className="text-2xl font-heading font-black text-navy mt-1">
                      One more time!
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Confirm your secret key so you never lose your progress.
                    </p>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegConfirm ? 'text' : 'password'}
                      autoFocus
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStepNext()}
                      placeholder="Repeat your secret key"
                      className="w-full pl-10 pr-10 py-3.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy text-base outline-none transition-all placeholder:text-text-muted font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {regConfirmPassword && (
                    <div className="text-xs flex items-center gap-1.5">
                      {regPassword === regConfirmPassword ? (
                        <span className="text-green font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Keys match perfectly!
                        </span>
                      ) : (
                        <span className="text-red font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Keys do not match yet.
                        </span>
                      )}
                    </div>
                  )}

                  {/* Summary Review box */}
                  <div className="p-3 bg-card-subtle rounded-xl border-2 border-border text-xs text-text-secondary space-y-1 font-mono">
                    <div>Explorer: <strong className="text-navy">{regDisplayName || 'Explorer'}</strong></div>
                    <div>Designation: <span className="text-purple font-bold">{regDesignation}</span></div>
                    <div>Contact: <span className="text-navy">{regEmail}</span></div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {registerStep > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.click();
                      setRegisterStep(registerStep - 1);
                      setRegError('');
                    }}
                    onMouseEnter={playHover}
                    className="game-btn game-btn-card py-3 px-4 text-xs font-heading font-bold text-navy"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStepNext}
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                  className="flex-1 py-3.5 px-5 rounded-xl game-btn game-btn-purple text-white font-heading font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {registerStep === 5
                      ? (isSubmitting ? 'Creating Secure Account...' : 'Complete Registration & Verify')
                      : 'Continue to Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-text-secondary">
                <span>Already have a key? </span>
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-green font-bold hover:underline cursor-pointer"
                >
                  Back to Explorer Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: EMAIL VERIFICATION STEP */}
          {activeTab === 'verify' && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-mono text-purple tracking-widest uppercase font-bold">
                  SECURITY CLEARANCE
                </span>
                <h2 className="text-2xl font-heading font-black text-navy mt-1">
                  Verify your email address
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  We have dispatched a 6-digit confirmation code to <strong className="text-navy">{verifyEmail}</strong>.
                </p>
              </div>

              {/* Simulated Code Inbox Notification */}
              {activeVerificationCode && (
                <div className="p-3.5 rounded-xl bg-card-subtle border-2 border-purple/30 text-xs text-text-secondary space-y-1.5">
                  <div className="flex items-center justify-between text-purple font-mono font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      SIMULATED INBOX DISPATCH
                    </span>
                    <span className="text-text-muted">PROTOTYPE HELPER</span>
                  </div>
                  <p className="text-text-secondary text-[11px]">
                    Your 6-digit verification code is:
                  </p>
                  <div className="font-mono text-lg font-black tracking-widest text-navy bg-card px-3 py-1.5 rounded-lg border-2 border-border inline-block">
                    {activeVerificationCode}
                  </div>
                </div>
              )}

              {verifySuccessMsg && (
                <div className="p-3 rounded-xl bg-green/10 border-2 border-green/30 text-green text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                  <span>{verifySuccessMsg}</span>
                </div>
              )}

              {verifyError && (
                <div className="p-3 rounded-xl bg-red/10 border-2 border-red/30 text-red text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red shrink-0" />
                  <span>{verifyError}</span>
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5 font-heading">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3.5 bg-card-subtle border-2 border-border focus:border-green rounded-xl text-navy outline-none font-bold placeholder:text-text-muted"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyCode.length < 6}
                  onMouseEnter={playHover}
                  className="w-full py-3.5 px-4 rounded-xl game-btn game-btn-green text-white font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Confirm Email & Enter Realm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t-2 border-border">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-purple font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-text-muted hover:text-navy cursor-pointer font-bold"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: FORGOT PASSWORD RECOVERY */}
          {activeTab === 'forgot' && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-mono text-gold tracking-widest uppercase font-bold">
                  CREDENTIAL RECOVERY
                </span>
                <h2 className="text-2xl font-heading font-black text-navy mt-1">
                  Reset your secret key
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  {forgotStep === 'email'
                    ? 'Enter your registered email address to receive a reset code.'
                    : 'Enter the recovery code dispatched to your email and choose a new secret key.'}
                </p>
              </div>

              {activeResetCode && (
                <div className="p-3.5 rounded-xl bg-card-subtle border-2 border-gold/40 text-xs text-text-secondary space-y-1">
                  <div className="flex items-center justify-between text-gold font-mono font-bold text-[11px]">
                    <span>RECOVERY CODE DISPATCHED</span>
                    <span className="text-text-muted">PROTOTYPE HELPER</span>
                  </div>
                  <p className="text-text-secondary text-[11px]">Use this 6-digit recovery code:</p>
                  <div className="font-mono text-lg font-black tracking-widest text-navy bg-card px-3 py-1.5 rounded-lg border-2 border-border inline-block">
                    {activeResetCode}
                  </div>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 rounded-xl bg-green/10 border-2 border-green/30 text-green text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {forgotError && (
                <div className="p-3 rounded-xl bg-red/10 border-2 border-red/30 text-red text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotStep === 'email' ? (
                <form onSubmit={handleForgotRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5 font-heading">
                      Your Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        autoFocus
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="explorer@codesprint.gg"
                        required
                        className="w-full pl-10 pr-3.5 py-3 bg-card-subtle border-2 border-border focus:border-gold rounded-xl text-navy text-sm outline-none placeholder:text-text-muted font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={playHover}
                    className="w-full py-3.5 px-4 rounded-xl game-btn game-btn-gold text-navy font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Recovery Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5 font-heading">
                      6-Digit Recovery Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      className="w-full tracking-widest font-mono text-center py-2.5 bg-card-subtle border-2 border-border focus:border-gold rounded-xl text-navy text-lg font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5 font-heading">
                      New Secret Key (8+ characters)
                    </label>
                    <input
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Enter new secret key"
                      required
                      className="w-full px-3.5 py-3 bg-card-subtle border-2 border-border focus:border-gold rounded-xl text-navy text-sm outline-none placeholder:text-text-muted font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    onMouseEnter={playHover}
                    className="w-full py-3.5 px-4 rounded-xl game-btn game-btn-green text-white font-heading font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Update Secret Key</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="text-center pt-2 text-xs text-text-secondary">
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-purple font-bold hover:underline cursor-pointer"
                >
                  Return to Explorer Login
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted font-mono z-10 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green" />
          <span>CODESPRINT REALM · ZERO PLAIN-TEXT SECURITY</span>
        </div>
        <div className="text-text-secondary">
          SHA-256 SALTED VAULT · 4 CODING ISLES
        </div>
      </footer>
    </div>
  );
};
