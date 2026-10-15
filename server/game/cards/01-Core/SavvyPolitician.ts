import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';

class SavvyPolitician extends DrawCard {
    static id = 'savvy-politician';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onCardHonored: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character
            }, honor());
    }
}


export default SavvyPolitician;
