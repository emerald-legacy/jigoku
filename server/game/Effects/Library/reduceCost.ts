import type { AbilityContext } from '../../AbilityContext.js';
import { EffectNames } from '../../Constants.js';
import type { CostReducer, CostReducerProps } from '../../CostReducer.js';
import type Player from '../../player.js';
import { EffectBuilder } from '../EffectBuilder.js';

export function reduceCost(properties: CostReducerProps) {
    return EffectBuilder.player.detached(EffectNames.CostReducer, {
        apply: (player: Player, context: AbilityContext) => player.addCostReducer(context.source, properties),
        unapply: (player: Player, context: AbilityContext, reducer: CostReducer) => player.removeCostReducer(reducer)
    });
}
