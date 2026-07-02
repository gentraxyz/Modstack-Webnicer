import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react';
import type { SkinViewer } from 'skinview3d';
import {
  type StudioState,
  type StudioAction,
  type StudioContextValue,
  type PoseState,
  type BodyPartKey,
  DEFAULT_POSE,
  type RecentSkin,
  type CustomPose,
} from '../types/studioTypes';

const RECENTS_KEY = 'modstack.studio.recents';
const CUSTOMS_KEY = 'modstack.studio.customPoses';
const MAX_UNDO = 50;

function loadRecents(): RecentSkin[] {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); } catch { return []; }
}
function loadCustoms(): CustomPose[] {
  try { return JSON.parse(localStorage.getItem(CUSTOMS_KEY) || '[]'); } catch { return []; }
}

const initialState: StudioState = {
  modelType: 'default',
  modelAuto: true,
  detectedModel: 'default',
  skinSource: null,
  skinPreview: null,
  pose: { ...DEFAULT_POSE },
  scene: {
    backgroundType: 'transparent',
    solidColor: '#1a2233',
    ambientIntensity: 3,
    cameraLightIntensity: 0.6,
    shadows: true,
    zoom: 0.9,
    fov: 50,
    gridVisible: true,
    gridColor: '#2596be',
  },
  animation: 'none',
  animationSpeed: 1,
  exportSettings: { resolution: '1080p', transparentBackground: true, hideGrid: true },
  undoStack: [],
  redoStack: [],
  recents: loadRecents(),
  customPoses: loadCustoms(),
};

function clone(p: PoseState): PoseState {
  return {
    head: [...p.head], body: [...p.body], leftArm: [...p.leftArm], rightArm: [...p.rightArm],
    leftLeg: [...p.leftLeg], rightLeg: [...p.rightLeg],
  };
}

function reducer(state: StudioState, action: StudioAction): StudioState {
  switch (action.type) {
    case 'SET_SKIN':
      return { ...state, skinSource: action.source, skinPreview: action.preview, modelType: action.model, detectedModel: action.detected };
    case 'SET_MODEL':
      return { ...state, modelType: action.model, modelAuto: action.auto };
    case 'SET_POSE': {
      const undo = action.snapshot === false ? state.undoStack : [...state.undoStack, clone(state.pose)].slice(-MAX_UNDO);
      return { ...state, pose: clone(action.pose), undoStack: undo, redoStack: action.snapshot === false ? state.redoStack : [] };
    }
    case 'SET_PART': {
      const prev = clone(state.pose);
      const next = clone(state.pose);
      next[action.part][action.index] = action.value;
      return { ...state, pose: next, undoStack: [...state.undoStack, prev].slice(-MAX_UNDO), redoStack: [] };
    }
    case 'RESET_POSE':
      return { ...state, pose: clone(DEFAULT_POSE), undoStack: [...state.undoStack, clone(state.pose)].slice(-MAX_UNDO), redoStack: [] };
    case 'MIRROR_POSE': {
      const m = clone(state.pose);
      const swap = (a: BodyPartKey, b: BodyPartKey) => { const t = [...m[a]] as [number, number, number]; m[a] = [...m[b]] as [number, number, number]; m[b] = t; };
      swap('leftArm', 'rightArm');
      swap('leftLeg', 'rightLeg');
      (['leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'head', 'body'] as BodyPartKey[]).forEach((k) => {
        m[k] = [m[k][0], m[k][1], -m[k][2]];
      });
      return { ...state, pose: m, undoStack: [...state.undoStack, clone(state.pose)].slice(-MAX_UNDO), redoStack: [] };
    }
    case 'APPLY_PRESET':
      return { ...state, pose: clone(action.pose), undoStack: [...state.undoStack, clone(state.pose)].slice(-MAX_UNDO), redoStack: [] };
    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return { ...state, pose: clone(prev), undoStack: state.undoStack.slice(0, -1), redoStack: [...state.redoStack, clone(state.pose)].slice(-MAX_UNDO) };
    }
    case 'REDO': {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return { ...state, pose: clone(next), redoStack: state.redoStack.slice(0, -1), undoStack: [...state.undoStack, clone(state.pose)].slice(-MAX_UNDO) };
    }
    case 'SET_SCENE':
      return { ...state, scene: { ...state.scene, ...action.patch } };
    case 'SET_ANIMATION':
      return { ...state, animation: action.animation };
    case 'SET_ANIMATION_SPEED':
      return { ...state, animationSpeed: action.speed };
    case 'SET_EXPORT':
      return { ...state, exportSettings: { ...state.exportSettings, ...action.patch } };
    case 'ADD_RECENT': {
      const recents = [action.rec, ...state.recents.filter((r) => r.id !== action.rec.id)].slice(0, 10);
      return { ...state, recents };
    }
    case 'REMOVE_RECENT':
      return { ...state, recents: state.recents.filter((r) => r.id !== action.id) };
    case 'ADD_CUSTOM_POSE':
      return { ...state, customPoses: [action.pose, ...state.customPoses] };
    case 'REMOVE_CUSTOM_POSE':
      return { ...state, customPoses: state.customPoses.filter((p) => p.id !== action.id) };
    case 'IMPORT_CUSTOM_POSES':
      return { ...state, customPoses: [...action.poses, ...state.customPoses] };
    default:
      return state;
  }
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const viewerRef = useRef<SkinViewer | null>(null);

  const applyPoseToViewer = useCallback((pose: PoseState) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const sk = viewer.playerObject.skin;
    sk.head.rotation.set(pose.head[0], pose.head[1], pose.head[2]);
    sk.body.rotation.set(pose.body[0], pose.body[1], pose.body[2]);
    sk.leftArm.rotation.set(pose.leftArm[0], pose.leftArm[1], pose.leftArm[2]);
    sk.rightArm.rotation.set(pose.rightArm[0], pose.rightArm[1], pose.rightArm[2]);
    sk.leftLeg.rotation.set(pose.leftLeg[0], pose.leftLeg[1], pose.leftLeg[2]);
    sk.rightLeg.rotation.set(pose.rightLeg[0], pose.rightLeg[1], pose.rightLeg[2]);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(RECENTS_KEY, JSON.stringify(state.recents)); } catch { /* ignore */ }
  }, [state.recents]);
  useEffect(() => {
    try { localStorage.setItem(CUSTOMS_KEY, JSON.stringify(state.customPoses)); } catch { /* ignore */ }
  }, [state.customPoses]);

  const value: StudioContextValue = { state, viewerRef, dispatch, applyPoseToViewer };
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudioState(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudioState must be used within StudioProvider');
  return ctx;
}