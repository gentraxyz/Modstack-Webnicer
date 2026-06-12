import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iconImg from '../images/placeholder.png';
import titleImg from '../images/modstack-title.png';
import { API, isValidUsername, sanitizeText, initSession } from '../auth';

// Read the token once at module load: the signup token is a JWT
// (base64url segments separated by DOTS). Reading it here also survives
// StrictMode double-running effects after the hash has been cleared.
const initialToken = new URLSearchParams(window.location.hash.slice(1)).get('signup');

export default function SignupPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [useProviderAvatar, setUseProviderAvatar] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (initialToken && /^[A-Za-z0-9\-_.]+$/.test(initialToken)) {
      setToken(initialToken);
      history.replaceState(null, '', '/signup');
    } else {
      setInvalid(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!isValidUsername(username)) {
      setError('Username must be 3–16 characters: letters, numbers and _');
      return;
    }
    if (!token) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/complete-signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, useProviderAvatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(sanitizeText(data.error) || 'Failed to create account.');
        return;
      }
      // Session is set via cookie; do a refresh to populate state
      await initSession();
      navigate('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (invalid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ background: '#0f1923' }}>
        <img src={iconImg} alt="logo" className="w-10 h-10 mb-4" />
        <p className="text-zinc-400 mb-4">Invalid or missing signup token.</p>
        <a href="/" className="text-[#2596be] hover:underline text-sm">Go home</a>
      </div>
    );
  }

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
          <h1 className="text-white text-xl font-bold mb-1">Create your account</h1>
          <p className="text-zinc-400 text-sm mb-6">Choose a username to finish setting up your Modstack account.</p>

          <div className="mb-4">
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                setUsername(val.slice(0, 16));
                setError('');
              }}
              maxLength={16}
              placeholder="your_username"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#2596be] transition-colors text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <p className="text-zinc-600 text-xs mt-1.5">
              Letters, numbers and underscores · 3–16 chars (Minecraft rules)
            </p>
          </div>

          <div className="mb-5">
            <label
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => setUseProviderAvatar(v => !v)}
            >
              <div
                className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  useProviderAvatar ? 'bg-[#2596be]' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    useProviderAvatar ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-zinc-300 text-sm">Use my Google / Discord avatar</span>
            </label>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !username}
            className="w-full py-3 bg-[#2596be] hover:bg-[#2bb1e0] disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_4px_0_rgb(29,123,158)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(29,123,158)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(29,123,158)] transition-all duration-150 text-sm"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-4">
          By creating an account you agree to our{' '}
          <a href="/terms" className="text-zinc-400 hover:text-[#2596be] transition-colors">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-zinc-400 hover:text-[#2596be] transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
