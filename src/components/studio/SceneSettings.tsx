import { Camera, Lightbulb, Layout, Eye } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import type { BackgroundType, ResolutionPreset } from '../../types/studioTypes';

function Slider({ label, value, min, max, step = 1, onChange, fmt }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="studio-slider-label"><span>{label}</span><span style={{ color: '#2596be' }}>{fmt ? fmt(value) : value}</span></div>
      <input type="range" className="studio-slider" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export default function SceneSettings() {
  const { state, dispatch, viewerRef } = useStudioState();
  const s = state.scene;

  const setScene = (patch: Partial<typeof s>) => dispatch({ type: 'SET_SCENE', patch });

  return (
    <div className="studio-panel-section">
      <div className="studio-section-title"><Layout size={12} /> Scene</div>

      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Background</div>
      <div className="studio-segmented" style={{ width: '100%', marginBottom: 8 }}>
        {(['transparent', 'solid'] as BackgroundType[]).map((t) => (
          <button key={t} className={s.backgroundType === t ? 'active' : ''} style={{ flex: 1 }} onClick={() => setScene({ backgroundType: t })}>{t === 'transparent' ? 'None' : 'Solid'}</button>
        ))}
      </div>
      {s.backgroundType === 'solid' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input type="color" className="studio-color-swatch" value={s.solidColor} onChange={(e) => setScene({ solidColor: e.target.value })} />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.solidColor}</span>
        </div>
      )}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '10px 0', paddingTop: 10 }}>
        <div className="studio-section-title"><Lightbulb size={12} /> Lighting</div>
        <Slider label="Ambient" value={s.ambientIntensity} min={0} max={6} step={0.1} onChange={(v) => setScene({ ambientIntensity: v })} fmt={(v) => v.toFixed(1)} />
        <Slider label="Light Source" value={s.cameraLightIntensity} min={0} max={3} step={0.1} onChange={(v) => setScene({ cameraLightIntensity: v })} fmt={(v) => v.toFixed(1)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
          <input type="checkbox" checked={s.shadows} onChange={(e) => setScene({ shadows: e.target.checked })} />
          Cast shadows
        </label>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '10px 0', paddingTop: 10 }}>
        <div className="studio-section-title"><Camera size={12} /> Camera</div>
        <Slider label="Zoom" value={s.zoom} min={0.3} max={2} step={0.05} onChange={(v) => setScene({ zoom: v })} fmt={(v) => `${v.toFixed(2)}x`} />
        <Slider label="FOV" value={s.fov} min={20} max={90} onChange={(v) => setScene({ fov: v })} fmt={(v) => `${v}°`} />
        <button className="studio-btn" style={{ width: '100%' }} onClick={() => { const v = viewerRef.current; if (v) v.resetCameraPose(); }}>
          <Camera size={13} /> Reset Camera
        </button>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '10px 0', paddingTop: 10 }}>
        <div className="studio-section-title"><Eye size={12} /> Grid Floor</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', cursor: 'pointer', marginBottom: 8 }}>
          <input type="checkbox" checked={s.gridVisible} onChange={(e) => setScene({ gridVisible: e.target.checked })} />
          Show grid
        </label>
        {s.gridVisible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" className="studio-color-swatch" value={s.gridColor} onChange={(e) => setScene({ gridColor: e.target.value })} />
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.gridColor}</span>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '10px 0', paddingTop: 10 }}>
        <div className="studio-section-title"><Eye size={12} /> Default Export Size</div>
        <div className="studio-segmented" style={{ width: '100%' }}>
          {(['720p', '1080p', '4k'] as ResolutionPreset[]).map((r) => (
            <button key={r} className={state.exportSettings.resolution === r ? 'active' : ''} style={{ flex: 1 }} onClick={() => dispatch({ type: 'SET_EXPORT', patch: { resolution: r } })}>{r.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </div>
  );
}