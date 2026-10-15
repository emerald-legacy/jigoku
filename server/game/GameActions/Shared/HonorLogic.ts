import { EffectName } from '../../Constants.js';
import type Player from '../../Player.js';

export function calculateHonorLimit(player: Player, round: number, phase: string, plannedHonorAmount: number): [boolean, number] {
    if(!player || !player.getEffects) {
        return [false, plannedHonorAmount];
    }

    const limits = player.getEffects(EffectName.LimitHonorGainPerPhase);
    if(limits.length === 0) {
        return [false, plannedHonorAmount];
    }

    const maxAmountToChange = Math.max(Math.min(...limits) - player.honorGained(round, phase, true), 0);
    return [true, Math.min(plannedHonorAmount, maxAmountToChange)];
}
