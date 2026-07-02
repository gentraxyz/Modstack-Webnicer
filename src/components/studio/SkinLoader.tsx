import { useRef, useState } from 'react';
import { Upload, Search, Image as ImageIcon, X } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import type { ModelType, RecentSkin } from '../../types/studioTypes';

export default function SkinLoader() {
  const { state, viewerRef, dispatch } = useStudioState();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const SKIN_PROVIDERS = [
    (u: string) => `https://mc-heads.net/skin/${u}`,
    (u: string) => `https://minotar.net/skin/${u}`,
    (u: string) => `https://mineskin.eu/skin/${u}`,
  ];

  const fetchSkinBlob = async (username: string): Promise<{ url: string; blob: Blob }> => {
    let lastErr = '';
    for (const mk of SKIN_PROVIDERS) {
      const url = mk(username);
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) { lastErr = `${url} → HTTP ${res.status}`; continue; }
        const type = res.headers.get('content-type') || '';
        const blob = await res.blob();
        if (!type.includes('png') && !type.includes('octet-stream') && blob.size < 256) {
          lastErr = `${url} → not a skin image`; continue;
        }
        return { url, blob };
      } catch (e) {
        lastErr = `${url} → ${(e as Error).message || 'network error'}`;
      }
    }
    throw new Error(lastErr || 'all providers failed');
  };

  const loadViewerFromBlob = async (blob: Blob): Promise<ModelType> => {
    const viewer = viewerRef.current;
    if (!viewer) throw new Error('Viewport not ready yet');
    const objUrl = URL.createObjectURL(blob);
    try {
      await viewer.loadSkin(objUrl, { model: 'auto-detect' });
    } finally {
      URL.revokeObjectURL(objUrl);
    }
    return viewer.playerObject.skin.modelType as ModelType;
  };

  const handleUsername = async () => {
    const name = username.trim();
    if (!name) return;
    setLoading(true); setErr('');
    try {
      const { url, blob } = await fetchSkinBlob(encodeURIComponent(name));
      const det = await loadViewerFromBlob(blob);
      const previewUrl = URL.createObjectURL(blob);
      dispatch({ type: 'SET_SKIN', source: url, preview: previewUrl, model: det, detected: det });
      dispatch({ type: 'ADD_RECENT', rec: { id: url, label: name, source: url, type: 'username', addedAt: Date.now() } });
    } catch (e) {
      setErr(`Could not load skin for "${name}". ${(e as Error).message || ''}`.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.includes('png')) { setErr('Only PNG skin files are supported.'); return; }
    setLoading(true); setErr('');
    const dataUrl = await new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result as string);
      fr.onerror = () => rej(new Error('read-failed'));
      fr.readAsDataURL(file);
    });
    try {
      const viewer = viewerRef.current;
      if (!viewer) throw new Error('Viewport not ready yet');
      await viewer.loadSkin(dataUrl, { model: 'auto-detect' });
      const det = viewer.playerObject.skin.modelType as ModelType;
      dispatch({ type: 'SET_SKIN', source: dataUrl, preview: dataUrl, model: state.modelAuto ? det : state.modelType, detected: det });
      dispatch({ type: 'ADD_RECENT', rec: { id: dataUrl.slice(0, 64), label: file.name, source: dataUrl, type: 'file', addedAt: Date.now() } });
    } catch {
      setErr('Failed to load that skin file.');
    } finally {
      setLoading(false);
    }
  };

  const applyRecent = async (r: RecentSkin) => {
    setLoading(true); setErr('');
    try {
      if (r.type === 'file') {
        // r.source is a data URL — same-origin, loads directly
        const viewer = viewerRef.current;
        if (!viewer) throw new Error('Viewport not ready yet');
        await viewer.loadSkin(r.source, { model: 'auto-detect' });
        const det = viewer.playerObject.skin.modelType as ModelType;
        dispatch({ type: 'SET_SKIN', source: r.source, preview: r.source, model: det, detected: det });
      } else {
        // username recent — re-fetch through the provider fallback chain
        const { url, blob } = await fetchSkinBlob(encodeURIComponent(r.label));
const det = await loadViewerFromBlob(blob);
        const previewUrl = URL.createObjectURL(blob);
        dispatch({ type: 'SET_SKIN', source: url, preview: previewUrl, model: det, detected: det });
      }
    } catch (e) {
      setErr(`Failed to reload. ${(e as Error)?.message || ''}`.trim());
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = (model: ModelType) => {
    dispatch({ type: 'SET_MODEL', model, auto: false });
  };

  return (
    <div className="studio-panel-section">
      <div className="studio-section-title"><ImageIcon size={12} /> Skin</div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          className="studio-input"
          placeholder="Minecraft username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUsername()}
        />
        <button className="studio-btn studio-btn--primary" onClick={handleUsername} disabled={loading} style={{ padding: '8px 10px' }}>
          <Search size={14} />
        </button>
      </div>
      {err && <div style={{ fontSize: 11, color: '#ffb4b4', marginBottom: 8 }}>{err}</div>}

      <div
        className={`studio-dropzone${dragging ? ' drag' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        style={{ marginBottom: 10 }}
      >
        <Upload size={18} style={{ margin: '0 auto 6px', display: 'block', opacity: 0.6 }} />
        <div>Drop a .png skin or <span style={{ color: '#2596be', fontWeight: 600 }}>browse</span></div>
      </div>
      <input ref={fileRef} type="file" accept="image/png" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ''; }} />

      {state.skinPreview && (
        <img src={state.skinPreview} alt="skin preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 10, display: 'block' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      )}

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Arm Model</div>
        <div className="studio-segmented" style={{ width: '100%' }}>
          <button className={state.modelAuto ? 'active' : ''} onClick={() => dispatch({ type: 'SET_MODEL', model: state.detectedModel, auto: true })}>Auto</button>
          <button className={!state.modelAuto && state.modelType === 'default' ? 'active' : ''} onClick={() => toggleModel('default')}>Classic</button>
          <button className={!state.modelAuto && state.modelType === 'slim' ? 'active' : ''} onClick={() => toggleModel('slim')}>Slim</button>
        </div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>Detected: {state.detectedModel === 'slim' ? 'Slim (Alex)' : 'Classic (Steve)'}</div>
      </div>

      {state.recents.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Recent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {state.recents.slice(0, 6).map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button className="studio-btn studio-btn--ghost" style={{ flex: 1, justifyContent: 'flex-start', fontSize: 12 }} onClick={() => applyRecent(r)} disabled={loading}>
                  {r.type === 'file' ? <ImageIcon size={12} /> : <Search size={12} />}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
                </button>
                <button className="studio-btn studio-btn--ghost" style={{ padding: 4 }} onClick={() => dispatch({ type: 'REMOVE_RECENT', id: r.id })}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}