import { EffectName } from '../../Constants.js';
import type { CostReducerProps } from '../../CostReducer.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function reduceCost(properties: CostReducerProps) {
    return EffectBuilder.player.detached(EffectName.CostReducer, {
        apply: (target, context) => target.addCostReducer(context.source, properties),
        unapply: (target, _context, reducer) => target.removeCostReducer(reducer)
    });
}
