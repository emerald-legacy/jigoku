import { perConflict } from '../../../AbilityLimit.js';
import { cardCannot } from '../../../effects.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { Players, RestrictionType, RestrictionScope } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';

export default class VengefulKami extends DrawCard {
    static id = 'vengeful-kami';

    public override setupCardAbilities() {
        const attackedBefore = (province: ProvinceCard, context: AbilityContext) =>
            context.game.getConflicts(Players.All).some((conflict) =>
                conflict.declaredProvince === province && conflict.uuid !== context.game.currentConflict?.uuid);

        this.conflictAction('Resolve Ring Effect', { evenFromHome: true })
            .ifCondition((context) => context.player.isDefendingPlayer() &&
                context.game.requireConflict()
                    .getConflictProvinces()
                    .some((province) => attackedBefore(province, context)))
            .ringTarget({
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    context.game.requireConflict()
                        .getConflictProvinces()
                        .some((province) => attackedBefore(province, context) && province.getElement().includes(ring.element))
            }, resolveRingEffect())
            .chatText('resolve the {0} effect')
            .max(perConflict(1));

        this.persistentEffect({
            effect: cardCannot({
                cannot: RestrictionType.ApplyCovert,
                appliesTo: RestrictionScope.OpponentsCardEffects
            })
        });
    }
}
