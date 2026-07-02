import { useState } from 'react';
import { RotateCcw, FlipHorizontal, ChevronDown } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import { BODY_PART_LABELS, AXIS_LABELS, type BodyPartKey } from '../../types/studioTypes';

const rad2deg = 180 / Math.PI;
const deg2rad = Math.PI / 180;
const PARTS: BodyPartKey[] = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

const DIAGRAM_PARTS: { key: BodyPartKey; cls: string; label: string }[] = [
  { key: 'leftArm', cls: 'bd-la', label: 'L Arm' },
  { key: 'rightArm', cls: 'bd-ra', label: 'R Arm' },
  { key: 'head', cls: 'bd-hd', label: 'Head' },
  { key: 'body', cls: 'bd-bd', label: 'Body' },
  { key: 'leftLeg', cls: 'bd-ll', label: 'L Leg' },
  { key: 'rightLeg', cls: 'bd-rl', label: 'R Leg' },
];

export default function PoseControls() {
  const { state, dispatch } = useStudioState();
  const [active, setActive] = useState<BodyPartKey | null>(null);
  const [open, setOpen] = useState<Record<BodyPartKey, boolean>>({ head: true, body: false, leftArm: false, rightArm: false, leftLeg: false, rightLeg: false });
  const animated = state.animation !== 'none';

  const setVal = (part: BodyPartKey, index: number, valueDeg: number) => {
    dispatch({ type: 'SET_PART', part, index, value: valueDeg * deg2rad });
  };
  const resetPart = (part: BodyPartKey) => {
    dispatch({ type: 'SET_POSE', pose: { ...state.pose, [part]: [0, 0, 0] as [number, number, number] } });
  };

  return (
    <div className="studio-panel-section">
      <div className="studio-section-title"><FlipHorizontal size={12} /> Pose</div>

      <div className="studio-body-diagram">
        {DIAGRAM_PARTS.map((p) => (
          <button key={p.key} className={`${p.cls}${active === p.key ? ' active' : ''}`} onClick={() => { setActive(p.key); setOpen((o) => ({ ...o, [p.key]: true })); }}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button className="studio-btn" style={{ flex: 1 }} onClick={() => dispatch({ type: 'RESET_POSE' })} disabled={animated}>
          <RotateCcw size={13} /> Reset All
        </button>
        <button className="studio-btn" style={{ flex: 1 }} onClick={() => dispatch({ type: 'MIRROR_POSE' })} disabled={animated}>
          <FlipHorizontal size={13} /> Mirror
        </button>
      </div>

      {animated && (
        <div style={{ fontSize: 10, color: '#caa84a', background: 'rgba(200,160,60,0.1)', border: '1px solid rgba(200,160,60,0.3)', padding: '6px 8px', borderRadius: 6, marginBottom: 10 }}>
          Sliders are read-only while an animation is playing. Stop the animation to pose manually.
        </div>
      )}

      {PARTS.map((part) => (
        <div key={part} style={{ marginBottom: 6 }}>
          <div className={`studio-bodypart-header${active === part ? ' active' : ''}`} onClick={() => setOpen((o) => ({ ...o, [part]: !o[part] }))}>
            <span className="title">{BODY_PART_LABELS[part]}</span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button className="studio-btn studio-btn--ghost" style={{ padding: 2 }} onClick={(e) => { e.stopPropagation(); resetPart(part); }} disabled={animated} title="Reset part"><RotateCcw size={12} /></button>
              <ChevronDown size={14} style={{ transform: open[part] ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </span>
          </div>
          {open[part] && (
            <div className="studio-bodypart-content">
              {[0, 1, 2].map((i) => {
                const deg = Math.round(state.pose[part][i] * rad2deg);
                return (
                  <div key={i}>
                    <div className="studio-slider-label"><span>{AXIS_LABELS[i]}</span><span style={{ color: '#2596be' }}>{deg}°</span></div>
                    <div className="studio-slider-row">
                      <input
                        type="range"
                        className="studio-slider"
                        min={-180}
                        max={180}
                        step={1}
                        value={deg}
                        disabled={animated}
                        onChange={(e) => setVal(part, i, Number(e.target.value))}
                      />
                      <input
                        type="number"
                        className="studio-input"
                        style={{ textAlign: 'center', padding: '4px 6px', fontSize: 11 }}
                        min={-180}
                        max={180}
                        value={deg}
                        disabled={animated}
                        onChange={(e) => setVal(part, i, Math.max(-180, Math.min(180, Number(e.target.value))))}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}