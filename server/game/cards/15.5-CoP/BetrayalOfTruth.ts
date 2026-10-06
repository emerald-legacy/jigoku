import DrawCard from '../../DrawCard.js';
import { bow } from '../../GameActions/GameActions.js';

class BetrayalOfTruth extends DrawCard {
    static id = 'betrayal-of-truth';

    setupCardAbilities() {
        this.action('Bow honored and dishonored characters')
            .condition(context => context.game.isDuringConflict() && context.game.findAnyCardsInPlay(card => card.isParticipating() && !card.isOrdinary()).length > 0)
            .gameAction(bow(context => ({
                target: context.game.findAnyCardsInPlay((card) => card.isParticipating() && !card.isOrdinary())
            })));
    }
}


export default BetrayalOfTruth;
