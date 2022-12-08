import { writable } from 'svelte/store';

export const currentAddress = writable('');
export const deployerAddress = writable('0xD1D239248Ef157D52308c3a53b3495C99E5771A7');
export const gameAddress = writable('');
export const refresh = writable(false);