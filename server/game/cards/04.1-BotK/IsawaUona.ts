import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class IsawaUona extends DrawCard {
    static id = 'isawa-uona';

    setupCardAbilities() {
        this.reaction('Bow a non-unique character in the conflict')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('air') && this.game.isDuringConflict()
            })
            .target({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && !card.isUnique()
            }, bow());
    }
}


export default IsawaUona;
