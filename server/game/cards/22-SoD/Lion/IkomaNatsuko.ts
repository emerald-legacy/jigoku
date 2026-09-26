import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaNatsuko extends DrawCard {
    static id = 'ikoma-natsuko';

    setupCardAbilities() {
        this.action('Bow and send home a participating character')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome())
            .effect('bow and send {0} home');
    }
}
