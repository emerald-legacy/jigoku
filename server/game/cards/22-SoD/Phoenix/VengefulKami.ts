import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictsDeclaredThisRound } from '../../ConflictsDeclaredThisRound.js';

export default class VengefulKami extends DrawCard {
    static id = 'vengeful-kami';

    public setupCardAbilities() {
        const declaredConflicts = new ConflictsDeclaredThisRound(this.game);

        this.action('Resolve Ring Effect')
            .condition(context => context.game.isDuringConflict() &&
                context.player.isDefendingPlayer() &&
                context.game.requireConflict()
                    .getConflictProvinces()
                    .some((province) => declaredConflicts.wasAttackedBefore(province, context.game.currentConflict)))
            .ringTarget('target', {
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    !!context && context.game.requireConflict()
                        .getConflictProvinces()
                        .some((province) => declaredConflicts.wasAttackedBefore(province, context.game.currentConflict) && province.getElement().includes(ring.element))
            }, AbilityDsl.actions.resolveRingEffect())
            .effect('resolve the {0} effect')
            .max(AbilityDsl.limit.perConflict(1));

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });
    }
}
