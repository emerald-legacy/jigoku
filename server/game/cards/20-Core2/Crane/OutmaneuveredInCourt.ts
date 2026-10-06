import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class OutmaneuveredInCourt extends DrawCard {
    static id = 'outmaneuvered-in-court';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isParticipating() && !card.isUnique()
            }, bow());
    }
}
