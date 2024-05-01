import { writable } from 'svelte/store';

export const debug = writable(false);
export const playerRigidBody = writable(undefined);
