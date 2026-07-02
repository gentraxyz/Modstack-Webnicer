import { useState } from 'react';
import { Download, Clipboard, X, Loader2 } from 'lucide-react';
import { GridHelper } from 'three';
import { useStudioState } from '../../hooks/useStudioState';
import { RESOLUTION_MAP } from '../../types/studioTypes';

function getGrid(viewer: any): GridHelper | null {
  for (const c of viewer.scene.children) {
    if (c instanceof GridHelper) return c;
  }
  return null;
}

export default function ExportPanel({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const { state, viewerRef, dispatch } = useStudioState();
  const ex = state.exportSettings;
  const [busy, setBusy] = useState(false);

  const render = async (w: number, h: number, transparent: boolean, hideGrid: boolean): Promise<Blob | null> => {
    const viewer = viewerRef.current;
    if (!viewer) return null;
    const prevBg = viewer.background;
    const grid = getGrid(viewer);
    if (transparent) viewer.background = null;
    if (hideGrid && grid) grid.visible = false;
    const oldSize = { width: viewer.width, height: viewer.height };
    const oldPR = viewer.pixelRatio;
    viewer.pixelRatio = 1;
    viewer.setSize(w, h);
    viewer.render();
    const blob = await new Promise<Blob | null>((res) => viewer.canvas.toBlob((b) => res(b), 'image/png'));
    viewer.setSize(oldSize.width, oldSize.height);
    viewer.pixelRatio = oldPR === 'match-device' ? (window.devicePixelRatio || 1) : oldPR;
    if (hideGrid && grid) grid.visible = true;
    viewer.background = prevBg;
    return blob;
  };

  const handleExport = async () => {
    setBusy(true);
    try {
      const r = RESOLUTION_MAP[ex.resolution];
      const blob = await render(r.width, r.height, ex.transparentBackground, ex.hideGrid);
      if (!blob) { onToast('Export failed.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modstack-studio-${ex.resolution}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      onToast(`Exported ${r.label} image.`);
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    setBusy(true);
    try {
      const blob = await render(720, 1280, ex.transparentBackground, ex.hideGrid);
      if (!blob) { onToast('Clipboard copy failed.'); return; }
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        onToast('Copied to clipboard.');
      } catch {
        onToast('Clipboard write not supported here. Use Download.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="studio-modal-overlay" onClick={onClose}>
      <div className="studio-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <strong style={{ color: '#2596be' }}>Export Render</strong>
          <button className="studio-btn studio-btn--ghost" onClick={onClose} style={{ padding: 4 }}><X size={16} /></button>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Resolution</div>
          <div className="studio-segmented" style={{ width: '100%', marginBottom: 14 }}>
            {(['720p', '1080p', '4k'] as const).map((r) => (
              <button key={r} className={ex.resolution === r ? 'active' : ''} style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_EXPORT', patch: { resolution: r } })}>
                {RESOLUTION_MAP[r].label} <span style={{ opacity: 0.6, fontSize: 10 }}>{RESOLUTION_MAP[r].width}×{RESOLUTION_MAP[r].height}</span>
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1', marginBottom: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={ex.transparentBackground} onChange={(e) => dispatch({ type: 'SET_EXPORT', patch: { transparentBackground: e.target.checked } })} />
            Transparent background {ex.transparentBackground ? '(PNG alpha)' : ''}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#cbd5e1', marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={ex.hideGrid} onChange={(e) => dispatch({ type: 'SET_EXPORT', patch: { hideGrid: e.target.checked } })} />
            Hide grid floor on render
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="studio-btn studio-btn--primary" onClick={handleExport} disabled={busy}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download PNG
            </button>
            <button className="studio-btn" onClick={handleCopy} disabled={busy}>
              <Clipboard size={14} /> Copy to clipboard
            </button>
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 12 }}>
            High resolutions (4K) require a capable GPU. If the canvas goes blank or the tab freezes, fall back to 1080p.
          </div>
        </div>
      </div>
    </div>
  );
}