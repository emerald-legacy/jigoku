export type AnimationEvent =
    | { type: 'water' | 'fire' | 'void'; targetUuid: string; effect: string }
    | { type: 'earth' | 'air'; playerName: string; effect: string };
