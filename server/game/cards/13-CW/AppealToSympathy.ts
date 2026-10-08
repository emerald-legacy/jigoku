import DrawCard from '../../DrawCard.js';
import { cancel, moveCard, multiple } from '../../GameActions/GameActions.js';
import { CardType, Location } from '../../Constants.js';

class AppealToSympathy extends DrawCard {
    static id = 'appeal-to-sympathy';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Event
            })
            .gameAction(multiple([
                cancel(),
                moveCard((context) => ({
                    target: context.event.card,
                    destination: context.event.card.isConflict ? Location.ConflictDeck : Location.DynastyDiscardPile
                }))
            ]))
            .chatText('cancel the effects of {1} and {2}', (context) => {
                const card = context.event.card;
                return [
                    card,
                    card.isConflict
                        ? 'return it to the top of its owner\'s conflict deck'
                        : 'move it to its owner\'s dynasty discard pile'
                ];
            })
            .cannotBeMirrored();
    }
}


export default AppealToSympathy;
