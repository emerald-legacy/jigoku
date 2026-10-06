import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { bow, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaNatsuko extends DrawCard {
    static id = 'ikoma-natsuko';

    setupCardAbilities() {
        this.conflictAction('Bow and send home a participating character')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, bow(), sendHome())
            .effect('bow and send {0} home');
    }
}
