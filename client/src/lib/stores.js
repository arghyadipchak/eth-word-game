import { writable } from 'svelte/store';

export const currentAddress = writable('');
export const deployerAddress = writable('0x426f182478d2289002A5875EAd39dD2A799C58D9');
export const gameAddress = writable('');
export const refresh = writable(false);