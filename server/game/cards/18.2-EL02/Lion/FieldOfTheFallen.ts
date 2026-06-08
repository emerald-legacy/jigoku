import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class FieldOfTheFallen extends DrawCard {
    static id = 'field-of-the-fallen';

    setupCardAbilities() {
        this.action({
            title: 'Discard then draw a card',
            condition: context => context.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.discardCard({ location: Location.Hand }),
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                let moreHonorable = context.player.isMoreHonorable();
                let gameActions = [];
                gameActions.push(AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: 1
                }))
                );
                if(moreHonorable) {
                    gameActions.push(AbilityDsl.actions.selectCard(context => ({
                        location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                        activePromptTitle: 'Select a card to place on the bottom of a deck',
                        message: '{0} places {1} on the bottom of {2}\'s {3} deck',
                        messageArgs: (card: DrawCard) => [context.player, card, card.owner, card.isDynasty ? 'dynasty' : 'conflict'],
                        gameAction: AbilityDsl.actions.returnToDeck({
                            location: Location.Any,
                            bottom: true
                        })
                    })));
                }

                return ({
                    gameActions: gameActions
                });
            })
        });
    }
}


export default FieldOfTheFallen;
