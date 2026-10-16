import { EffectName } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import { EffectBuilder } from '../EffectBuilder.js';
import type { DelayedEffectValue } from '../EffectValueMap.js';

export function delayedEffect<Source extends BaseCard = BaseCard>(properties: DelayedEffectValue<Source>) {
    return EffectBuilder.card.static(EffectName.DelayedEffect, properties);
}

export function playerDelayedEffect<Source extends BaseCard = BaseCard>(properties: DelayedEffectValue<Source>) {
    return EffectBuilder.player.static(EffectName.DelayedEffect, properties);
}
