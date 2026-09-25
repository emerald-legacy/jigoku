import { CardType } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FortressAtTheSeaOfFire extends StrongholdCard {
    static id = 'fortress-at-the-sea-of-fire';

    setupCardAbilities() {
        this.reaction('Bow a character')
            .when({ afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player })
            .cost(AbilityDsl.costs.bowSelf())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => !card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.ready());
    }
}
