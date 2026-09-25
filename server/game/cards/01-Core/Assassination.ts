import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Assassination extends DrawCard {
    static id = 'assassination';

    setupCardAbilities() {
        this.action('Discard a character')
            .cost(AbilityDsl.costs.payHonor(3))
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.costLessThan(3)
            }, AbilityDsl.actions.discardFromPlay())
            .max(AbilityDsl.limit.perRound(1));
    }
}


export default Assassination;
