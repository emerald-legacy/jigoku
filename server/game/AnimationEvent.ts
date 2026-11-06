import type { Element } from './Constants.js';

export type AnimationEvent =
    | { type: Element.Water | Element.Fire | Element.Void; targetUuid: string; effect: string }
    | { type: Element.Earth | Element.Air; playerName: string; effect: string }
    | { type: 'honor'; playerName: string; amount: number }
    | { type: 'fate'; playerName: string; amount: number }
    | { type: 'claim'; playerName: string; element: Element };
