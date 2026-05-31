import { EffectNames } from '../../Constants.js';
import type Player from '../../Player.js';
import { EffectBuilder } from '../EffectBuilder.js';

export type ChangePlayerGloryModifierValue = number | ((player: Player) => number);

export function changePlayerGloryModifier(value: ChangePlayerGloryModifierValue) {
    return EffectBuilder.player.flexible(EffectNames.ChangePlayerGloryModifier, value);
}
