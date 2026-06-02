import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class NobleSacrifice extends DrawCard {
    static id = 'noble-sacrifice';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice honored character to discard dishonored one',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: card => card.isHonored
            }),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isDishonored,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}


export default NobleSacrifice;
