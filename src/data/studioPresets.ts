import type { PoseState } from '../types/studioTypes';
import type { PosePreset } from '../types/studioTypes';

const P = Math.PI / 180;
const d = (...deg: number[]): [number, number, number] => [deg[0] * P, deg[1] * P, deg[2] * P];

const standing: PoseState = {
  head: [0, 0, 0], body: [0, 0, 0], leftArm: [0, 0, 0],
  rightArm: [0, 0, 0], leftLeg: [0, 0, 0], rightLeg: [0, 0, 0],
};

export const POSE_PRESETS: PosePreset[] = [
  { id: 'standing', name: 'Standing', category: 'basic', rotations: standing },
  {
    id: 'walking', name: 'Walking', category: 'action',
    rotations: { head: d(5, 0, 0), body: d(0, 0, 0), leftArm: d(-30, 0, 0), rightArm: d(30, 0, 0), leftLeg: d(30, 0, 0), rightLeg: d(-30, 0, 0) },
  },
  {
    id: 'running', name: 'Running', category: 'action',
    rotations: { head: d(10, 0, 0), body: d(12, 0, 0), leftArm: d(-60, 0, 10), rightArm: d(60, 0, -10), leftLeg: d(55, 0, 0), rightLeg: d(-50, 0, 0) },
  },
  {
    id: 'waving', name: 'Waving', category: 'emote',
    rotations: { head: d(0, -8, 0), body: d(0, 0, 0), leftArm: d(0, 0, 8), rightArm: d(-150, 25, 0), leftLeg: [0, 0, 0], rightLeg: [0, 0, 0] },
  },
  {
    id: 'pointing', name: 'Pointing', category: 'emote',
    rotations: { head: d(0, 10, 0), body: d(0, -5, 0), leftArm: d(0, 0, 6), rightArm: d(-90, 0, 0), leftLeg: [0, 0, 0], rightLeg: [0, 0, 0] },
  },
  {
    id: 'fighting', name: 'Fighting', category: 'action',
    rotations: { head: d(0, 10, 0), body: d(0, -15, 0), leftArm: d(-45, 0, -20), rightArm: d(-90, 0, 30), leftLeg: d(0, 0, 0), rightLeg: d(-15, 0, 0) },
  },
  
  {
    id: 'sitting', name: 'Sitting', category: 'basic',
    rotations: { head: d(-5, 0, 0), body: d(-5, 0, 0), leftArm: d(-90, 0, 8), rightArm: d(-90, 0, -8), leftLeg: d(-90, 0, -10), rightLeg: d(-90, 0, 10) },
  },
  
  {
    id: 'leaning', name: 'Leaning', category: 'basic',
    rotations: { head: d(0, 20, 0), body: d(0, 20, 5), leftArm: d(0, 0, 15), rightArm: d(-20, 0, -25), leftLeg: d(0, 0, -5), rightLeg: d(0, 0, 5) },
  },
  {
    id: 'arms-crossed', name: 'Arms Crossed', category: 'emote',
    rotations: { head: d(0, 0, 0), body: d(0, 0, 0), leftArm: d(-85, 0, 45), rightArm: d(-85, 0, -45), leftLeg: [0, 0, 0], rightLeg: [0, 0, 0] },
  },
  {
    id: 'dabbing', name: 'Dabbing', category: 'emote',
    rotations: { head: d(-10, 15, 25), body: d(0, 0, 0), leftArm: d(-170, -20, 20), rightArm: d(-45, 30, -60), leftLeg: d(0, 0, 0), rightLeg: d(0, 0, 0) },
  },
  {
    id: 'tpose', name: 'T-Pose', category: 'basic',
    rotations: { head: d(0, 0, 0), body: d(0, 0, 0), leftArm: d(0, 0, 90), rightArm: d(0, 0, -90), leftLeg: [0, 0, 0], rightLeg: [0, 0, 0] },
  },
  
  {
    id: 'victory', name: 'Victory', category: 'emote',
    rotations: { head: d(0, 0, 0), body: d(0, 0, 0), leftArm: d(-170, 0, 10), rightArm: d(-170, 0, -10), leftLeg: d(0, 0, 0), rightLeg: d(0, 0, 0) },
  },
];