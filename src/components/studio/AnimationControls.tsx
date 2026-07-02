import { Play, Gauge } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import type { AnimationKind } from '../../types/studioTypes';

const ANIMS: { key: AnimationKind; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'idle', label: 'Idle' },
  { key: 'walking', label: 'Walk' },
  { key: 'running', label: 'Run' },
  { key: 'flying', label: 'Fly' },
];

export default function AnimationControls() {
  const { state, dispatch } = useStudioState();
  return (
    <div className="studio-panel-section">
      <div className="studio-section-title"><Play size={12} /> Animation</div>
      <div className="studio-segmented" style={{ width: '100%', marginBottom: 10, flexWrap: 'wrap' }}>
        {ANIMS.map((a) => (
          <button key={a.key} className={state.animation === a.key ? 'active' : ''} style={{ flex: '1 0 30%' }} onClick={() => dispatch({ type: 'SET_ANIMATION', animation: a.key })}>
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Gauge size={13} style={{ color: '#94a3b8' }} />
        <input type="range" className="studio-slider" min={0.1} max={3} step={0.1} value={state.animationSpeed} onChange={(e) => dispatch({ type: 'SET_ANIMATION_SPEED', speed: Number(e.target.value) })} />
        <span style={{ fontSize: 11, color: '#2596be', width: 32, textAlign: 'right' }}>{state.animationSpeed.toFixed(1)}x</span>
      </div>
      {state.animation !== 'none' && (
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>Manual pose controls are locked while animating.</div>
      )}
    </div>
  );
}