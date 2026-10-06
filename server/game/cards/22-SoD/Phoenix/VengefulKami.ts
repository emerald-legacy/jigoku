import AbilityDsl from '../../../abilitydsl.js';
import { cardCannot } from '../../../effects.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictsDeclaredThisRound } from '../../ConflictsDeclaredThisRound.js';

export default class VengefulKami extends DrawCard {
    static id = 'vengeful-kami';

    public setupCardAbilities() {
        const declaredConflicts = new ConflictsDeclaredThisRound(this.game);

        this.conflictAction('Resolve Ring Effect', { evenFromHome: true })
            .condition(context => context.player.isDefendingPlayer() &&
                context.game.requireConflict()
                    .getConflictProvinces()
                    .some((province) => declaredConflicts.wasAttackedBefore(province, context.game.currentConflict)))
            .ringTarget({
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    context.game.requireConflict()
                        .getConflictProvinces()
                        .some((province) => declaredConflicts.wasAttackedBefore(province, context.game.currentConflict) && province.getElement().includes(ring.element))
            }, resolveRingEffect())
            .effect('resolve the {0} effect')
            .max(AbilityDsl.limit.perConflict(1));

        this.persistentEffect({
            effect: cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });
    }
}
