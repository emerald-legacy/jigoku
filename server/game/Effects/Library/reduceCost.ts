import { EffectNames } from '../../Constants.js';
import type { CostReducer, CostReducerProps } from '../../CostReducer.js';
import type Player from '../../Player.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function reduceCost(properties: CostReducerProps) {
    return EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (target, context) => (target as Player).addCostReducer(context.source, properties),
        unapply: (target, _context, reducer) => (target as Player).removeCostReducer(reducer as CostReducer)
    });
}
