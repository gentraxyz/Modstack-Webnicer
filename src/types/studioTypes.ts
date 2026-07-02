import type { SkinViewer } from 'skinview3d';

export type BodyPartKey = 'head' | 'body' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';

export type RotationTriplet = [number, number, number];

export type PoseState = Record<BodyPartKey, RotationTriplet>;

export type ModelType = 'default' | 'slim';

export type AnimationKind = 'none' | 'idle' | 'walking' | 'running' | 'flying';

export type BackgroundType = 'transparent' | 'solid';

export interface SceneSettings {
  backgroundType: BackgroundType;
  solidColor: string;
  ambientIntensity: number;
  cameraLightIntensity: number;
  shadows: boolean;
  zoom: number;
  fov: number;
  gridVisible: boolean;
  gridColor: string;
}

export type ResolutionPreset = '720p' | '1080p' | '4k';

export interface ExportSettings {
  resolution: ResolutionPreset;
  transparentBackground: boolean;
  hideGrid: boolean;
}

export interface PosePreset {
  id: string;
  name: string;
  category: 'basic' | 'action' | 'emote' | 'custom';
  rotations: PoseState;
}

export interface CustomPose {
  id: string;
  name: string;
  rotations: PoseState;
  createdAt: number;
}

export interface RecentSkin {
  id: string;
  label: string;
  source: string;
  type: 'username' | 'file';
  addedAt: number;
}

export interface StudioState {
  modelType: ModelType;
  modelAuto: boolean;
  detectedModel: ModelType;
  skinSource: string | null;
  skinPreview: string | null;
  pose: PoseState;
  scene: SceneSettings;
  animation: AnimationKind;
  animationSpeed: number;
  exportSettings: ExportSettings;
  undoStack: PoseState[];
  redoStack: PoseState[];
  recents: RecentSkin[];
  customPoses: CustomPose[];
}

export interface StudioContextValue {
  state: StudioState;
  viewerRef: React.MutableRefObject<SkinViewer | null>;
  dispatch: React.Dispatch<StudioAction>;
  applyPoseToViewer: (pose: PoseState) => void;
}

export type StudioAction =
  | { type: 'SET_SKIN'; source: string; preview: string | null; model: ModelType; detected: ModelType }
  | { type: 'SET_MODEL'; model: ModelType; auto: boolean }
  | { type: 'SET_POSE'; pose: PoseState; snapshot?: boolean }
  | { type: 'SET_PART'; part: BodyPartKey; index: number; value: number }
  | { type: 'RESET_POSE' }
  | { type: 'MIRROR_POSE' }
  | { type: 'APPLY_PRESET'; pose: PoseState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_SCENE'; patch: Partial<SceneSettings> }
  | { type: 'SET_ANIMATION'; animation: AnimationKind }
  | { type: 'SET_ANIMATION_SPEED'; speed: number }
  | { type: 'SET_EXPORT'; patch: Partial<ExportSettings> }
  | { type: 'ADD_RECENT'; rec: RecentSkin }
  | { type: 'REMOVE_RECENT'; id: string }
  | { type: 'ADD_CUSTOM_POSE'; pose: CustomPose }
  | { type: 'REMOVE_CUSTOM_POSE'; id: string }
  | { type: 'IMPORT_CUSTOM_POSES'; poses: CustomPose[] };

export const DEFAULT_POSE: PoseState = {
  head: [0, 0, 0],
  body: [0, 0, 0],
  leftArm: [0, 0, 0],
  rightArm: [0, 0, 0],
  leftLeg: [0, 0, 0],
  rightLeg: [0, 0, 0],
};

export const BODY_PART_LABELS: Record<BodyPartKey, string> = {
  head: 'Head',
  body: 'Body',
  leftArm: 'Left Arm',
  rightArm: 'Right Arm',
  leftLeg: 'Left Leg',
  rightLeg: 'Right Leg',
};

export const AXIS_LABELS = ['X (Pitch)', 'Y (Yaw)', 'Z (Roll)'] as const;

export const RESOLUTION_MAP: Record<ResolutionPreset, { width: number; height: number; label: string }> = {
  '720p': { width: 1280, height: 720, label: '720p' },
  '1080p': { width: 1920, height: 1080, label: '1080p' },
  '4k': { width: 3840, height: 2160, label: '4K' },
};