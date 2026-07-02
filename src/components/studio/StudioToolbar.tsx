import { Undo2, Redo2, Download, RotateCcw, Camera, Sparkles } from 'lucide-react';
import { useStudioState } from '../../hooks/useStudioState';
import iconImg from '../../images/placeholder.png';
import titleImg from '../../images/modstack-title.png';

interface Props {
  onExport: () => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

export default function StudioToolbar({ onExport, onToggleLeft, onToggleRight }: Props) {
  const { state, dispatch, viewerRef } = useStudioState();
  const canUndo = state.undoStack.length > 0;
  const canRedo = state.redoStack.length > 0;
  const animated = state.animation !== 'none';

  return (
    <div className="studio-toolbar">
      <button className="studio-btn studio-btn--icon studio-mobile-toggle" onClick={onToggleLeft} title="Skin & Scene">
        <Sparkles size={16} />
      </button>
      <a href="/" className="logo" style={{ textDecoration: 'none' }}>
        <div className="logo-mark"><img src={iconImg} alt="logo" /></div>
        <img src={titleImg} alt="title" className="h-4 w-auto relative" style={{ height: 16 }} />
      </a>
      <span className="studio-chip" style={{ marginLeft: 4 }}>Studio</span>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.25)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
        <button className="studio-btn studio-btn--ghost" onClick={() => dispatch({ type: 'UNDO' })} disabled={!canUndo || animated} title="Undo (Ctrl+Z)"><Undo2 size={16} /></button>
        <button className="studio-btn studio-btn--ghost" onClick={() => dispatch({ type: 'REDO' })} disabled={!canRedo || animated} title="Redo (Ctrl+Shift+Z)"><Redo2 size={16} /></button>
      </div>
      <button className="studio-btn studio-btn--ghost" onClick={() => dispatch({ type: 'RESET_POSE' })} disabled={animated} title="Reset pose"><RotateCcw size={16} /></button>
      <button className="studio-btn studio-btn--ghost" onClick={() => { const v = viewerRef.current; if (v) v.resetCameraPose(); }} title="Reset camera"><Camera size={16} /></button>

      <button className="studio-btn studio-btn--primary" onClick={onExport}>
        <Download size={15} /> Export
      </button>

      <button className="studio-btn studio-btn--icon studio-mobile-toggle" onClick={onToggleRight} title="Pose controls">
        <RotateCcw size={16} />
      </button>
    </div>
  );
}