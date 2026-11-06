import { EffectName } from '../../Constants.js';
import type Player from '../../Player.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function takeControl(player: Player | undefined) {
    return EffectBuilder.card.static(EffectName.TakeControl, player);
}
