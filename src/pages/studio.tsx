import { useEffect, useRef, useState } from 'react';
import { StudioProvider, useStudioState } from '../hooks/useStudioState';
import StudioToolbar from '../components/studio/StudioToolbar';
import StudioViewport from '../components/studio/StudioViewport';
import SkinLoader from '../components/studio/SkinLoader';
import PosePresets from '../components/studio/PosePresets';
import SceneSettings from '../components/studio/SceneSettings';
import PoseControls from '../components/studio/PoseControls';
import AnimationControls from '../components/studio/AnimationControls';
import ExportPanel from '../components/studio/ExportPanel';
import { RESOLUTION_MAP } from '../types/studioTypes';
import '../styles/studio.css';

function StatusBar({ fps }: { fps: number }) {
  const { state } = useStudioState();
  const r = RESOLUTION_MAP[state.exportSettings.resolution];
  return (
    <div className="studio-statusbar">
      <span>Resolution: <span className="status-val">{r.width}×{r.height}</span></span>
      <span>FPS: <span className="status-val">{fps}</span></span>
      <span>Model: <span className="status-val">{state.modelAuto ? state.detectedModel : state.modelType}</span></span>
      <span style={{ marginLeft: 'auto' }}>Modstack Studio</span>
    </div>
  );
}

function StudioLayout() {
  const { dispatch, state } = useStudioState();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState({ fps: 0, zoom: 0.9 });
  const toastTimer = useRef<number | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) dispatch({ type: 'REDO' });
        else dispatch({ type: 'UNDO' });
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dispatch]);

  useEffect(() => {
    document.title = 'Modstack Studio — 3D Skin Pose Editor';
  }, []);

  return (
    <div className="studio-root">
      <StudioToolbar
        onExport={() => setExportOpen(true)}
        onToggleLeft={() => setLeftOpen((v) => !v)}
        onToggleRight={() => setRightOpen((v) => !v)}
      />
      <div className="studio-main">
        <aside className={`studio-panel studio-panel--left${leftOpen ? ' open' : ''}`}>
          <SkinLoader />
          <PosePresets />
          <SceneSettings />
        </aside>
        <StudioViewport onStatus={setStatus} />
        <aside className={`studio-panel studio-panel--right${rightOpen ? ' open' : ''}`}>
          <AnimationControls />
          <PoseControls />
        </aside>
      </div>
      <StatusBar fps={status.fps} />
      {exportOpen && <ExportPanel onClose={() => setExportOpen(false)} onToast={showToast} />}
      {toast && <div className="studio-toast">{toast}</div>}
      {state.skinSource === null && (
        <div className="studio-toast" style={{ bottom: 50, opacity: 0.7 }}>Tip: load a skin from the left panel.</div>
      )}
    </div>
  );
}

export default function StudioPage() {
  return (
    <StudioProvider>
      <StudioLayout />
    </StudioProvider>
  );
}