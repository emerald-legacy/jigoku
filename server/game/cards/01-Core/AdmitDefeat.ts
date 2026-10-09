import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class AdmitDefeat extends DrawCard {
    static id = 'admit-defeat';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition(() => this.game.currentConflict?.getNumberOfParticipantsFor('defender') === 1)
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, bow());
    }
}


export default AdmitDefeat;
