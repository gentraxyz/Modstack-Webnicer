import { useRef, useState } from 'react';
import { Save, Trash2, Download, Upload, Plus } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import { POSE_PRESETS } from '../../data/studioPresets';
import type { CustomPose, PoseState, PosePreset } from '../../types/studioTypes';

const uid = () => Math.random().toString(36).slice(2, 10);

export default function PosePresets() {
  const { state, dispatch } = useStudioState();
  const [name, setName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const animated = state.animation !== 'none';

  const apply = (p: PoseState) => {
    if (animated) return;
    dispatch({ type: 'APPLY_PRESET', pose: p });
  };

  const saveCustom = () => {
    const n = name.trim() || `Pose ${state.customPoses.length + 1}`;
    dispatch({ type: 'ADD_CUSTOM_POSE', pose: { id: uid(), name: n, rotations: state.pose, createdAt: Date.now() } });
    setName('');
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(state.customPoses, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'modstack-studio-poses.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importFile = (file: File) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const arr = JSON.parse(fr.result as string) as CustomPose[];
        const valid = arr.filter((p) => p && p.name && p.rotations).map((p) => ({ id: p.id || uid(), name: p.name, rotations: p.rotations, createdAt: p.createdAt || Date.now() }));
        dispatch({ type: 'IMPORT_CUSTOM_POSES', poses: valid });
      } catch {/* ignore invalid */}
    };
    fr.readAsText(file);
  };

  return (
    <div className="studio-panel-section">
      <div className="studio-section-title"><Plus size={12} /> Pose Presets</div>
      <div className="studio-preset-grid">
        {POSE_PRESETS.map((p: PosePreset) => (
          <button key={p.id} className="studio-preset-tile" onClick={() => apply(p.rotations)} title={p.name} disabled={animated} style={animated ? { opacity: 0.5 } : undefined}>
            <span className="name">{p.name}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Custom Poses</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input className="studio-input" placeholder="Pose name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveCustom()} style={{ fontSize: 12 }} />
          <button className="studio-btn studio-btn--primary" onClick={saveCustom} disabled={animated} title="Save current pose"><Save size={13} /></button>
          <button className="studio-btn" onClick={exportAll} title="Export all as JSON"><Download size={13} /></button>
          <button className="studio-btn" onClick={() => fileRef.current?.click()} title="Import poses JSON"><Upload size={13} /></button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.currentTarget.value = ''; }} />
        </div>

        {state.customPoses.length === 0 ? (
          <div style={{ fontSize: 11, color: '#64748b' }}>No saved poses yet. Pose the model then click save.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {state.customPoses.map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button className="studio-btn studio-btn--ghost" style={{ flex: 1, justifyContent: 'flex-start', fontSize: 12 }} onClick={() => apply(p.rotations)} disabled={animated}>
                  <Save size={11} /> {p.name}
                </button>
                <button className="studio-btn studio-btn--ghost" style={{ padding: 4 }} onClick={() => dispatch({ type: 'REMOVE_CUSTOM_POSE', id: p.id })} title="Delete"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}