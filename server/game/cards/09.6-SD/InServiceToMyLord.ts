import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { canPlayFromOwn } from '../../effects.js';
import { moveCard, multiple, ready } from '../../GameActions/GameActions.js';
import { Location, PlayType, CardType } from '../../Constants.js';

class InServiceToMyLord extends DrawCard {
    static id = 'in-service-to-my-lord';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.ConflictDiscardPile,
            effect: canPlayFromOwn(Location.ConflictDiscardPile, [this], this, PlayType.Other)
        });
        this.action('Ready a character')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique()
            }))
            .target({
                activePromptTitle: 'Choose a unique character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isUnique()
            }, multiple([
                ready(),
                moveCard((context) => ({
                    target: context.source,
                    destination: Location.ConflictDeck,
                    bottom: true
                }))
            ]))
            .chatText('ready {0}. {1} is placed on the bottom of {2}\'s conflict deck', (context) => [context.source, context.source.owner]);
    }
}


export default InServiceToMyLord;
