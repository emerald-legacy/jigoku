import { CardTypes } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FortressAtTheSeaOfFire extends StrongholdCard {
    static id = 'fortress-at-the-sea-of-fire';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            cost: AbilityDsl.costs.bowSelf(),
            when: { afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.isParticipating(),
                gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.ready()]
            }
        });
    }
}
