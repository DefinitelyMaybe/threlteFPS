import { writable } from 'svelte/store';
import type CameraControls from './components/camera-controls.svelte.d.ts';

export const debug = writable(false);
export const pointerLocked = writable(false);
export const cameraControls: CameraControls = writable(undefined);
