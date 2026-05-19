import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class OutmaneuveredInCourt extends DrawCard {
    static id = 'outmaneuvered-in-court';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            cost: AbilityDsl.costs.discardImperialFavor(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isParticipating() && !card.isUnique(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
