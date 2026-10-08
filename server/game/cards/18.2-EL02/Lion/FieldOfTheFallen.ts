import DrawCard from '../../../DrawCard.js';
import { Location, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { draw, returnToDeck, selectCard, sequentialContext } from '../../../GameActions/GameActions.js';

class FieldOfTheFallen extends DrawCard {
    static id = 'field-of-the-fallen';

    setupCardAbilities() {
        this.action('Discard then draw a card')
            .cost(costs.discardCard({ location: Location.Hand }))
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .gameAction(sequentialContext((context) => {
                const moreHonorable = context.player.isMoreHonorable();
                const gameActions = [];
                gameActions.push(draw((context) => ({
                    target: context.player
                }))
                );
                if(moreHonorable) {
                    gameActions.push(selectCard((context) => ({
                        location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                        activePromptTitle: 'Select a card to place on the bottom of a deck',
                        message: '{0} places {1} on the bottom of {2}\'s {3} deck',
                        messageArgs: (card) => [context.player, card, card.owner, card.isDynasty ? 'dynasty' : 'conflict'],
                        gameAction: returnToDeck({
                            location: Location.Any,
                            bottom: true
                        })
                    })));
                }

                return ({
                    gameActions: gameActions
                });
            }));
    }
}


export default FieldOfTheFallen;
