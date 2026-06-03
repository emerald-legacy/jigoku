import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AdmitDefeat extends DrawCard {
    static id = 'admit-defeat';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () =>
                this.game.isDuringConflict() &&
                this.game.currentConflict?.getNumberOfParticipantsFor('defender') === 1,
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isDefending(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default AdmitDefeat;
