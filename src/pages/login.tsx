import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconImg from '../images/placeholder.png';
import titleImg from '../images/modstack-title.png';
import { API, getCurrentUser } from '../auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();

  // If already logged in, send home
  useEffect(() => {
    if (getCurrentUser()) navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: '#0f1923',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(37,150,190,0.07) 0%, transparent 55%)',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <img src={iconImg} alt="logo" className="w-12 h-12" />
          <img src={titleImg} alt="Modstack" className="h-5 w-auto" />
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h1 className="text-white text-xl font-bold mb-1 text-center">Sign in</h1>
          <p className="text-zinc-400 text-sm mb-6 text-center">
            Choose a provider to continue to Modstack.
          </p>

          <div className="flex flex-col gap-3">
            {/* Google */}
            <a
              href={`${API}/auth/google`}
              className="flex items-center gap-3 px-4 py-3 bg-white text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-100 transition-colors shadow-sm"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </a>

            {/* Discord */}
            <a
              href={`${API}/auth/discord`}
              className="flex items-center gap-3 px-4 py-3 bg-[#5865F2] text-white font-semibold text-sm rounded-xl shadow-[0_4px_0_rgb(71,82,196)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(71,82,196)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(71,82,196)] transition-all duration-150"
            >
              <DiscordIcon />
              <span>Continue with Discord</span>
            </a>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          By signing in you agree to our{' '}
          <a href="/terms" className="text-zinc-400 hover:text-[#2596be] transition-colors">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-zinc-400 hover:text-[#2596be] transition-colors">Privacy Policy</a>.
        </p>

        <div className="text-center mt-4">
          <a href="/" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
