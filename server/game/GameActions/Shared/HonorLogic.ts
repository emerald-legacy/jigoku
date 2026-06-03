import { EffectName } from '../../Constants.js';
import type Player from '../../Player.js';

export function CalculateHonorLimit(player: Player, round: number, phase: string, plannedHonorAmount: number): [boolean, number] {
    if(!player || !player.getEffects) {
        return [false, plannedHonorAmount];
    }

    const honorGainLimitPerPhase = Math.min(...player.getEffects(EffectName.LimitHonorGainPerPhase));
    const honorGainedThisPhase = player.honorGained(round, phase, true);

    const maxAmountToChange = Math.max(honorGainLimitPerPhase - honorGainedThisPhase, 0);
    const amountToChange = Math.min(plannedHonorAmount, maxAmountToChange);
    if(!honorGainLimitPerPhase) {
        return [false, plannedHonorAmount];
    }
    return [true, amountToChange];
}
