import DrawCard from '../../../drawcard.js';
import { Locations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class FieldOfTheFallen extends DrawCard {
    static id = 'field-of-the-fallen';

    setupCardAbilities() {
        this.action({
            title: 'Discard then draw a card',
            condition: context => context.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
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
                        location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                        player: Players.Any,
                        activePromptTitle: 'Select a card to place on the bottom of a deck',
                        message: '{0} places {1} on the bottom of {2}\'s {3} deck',
                        messageArgs: card => [context.player, card, card.owner, card.isDynasty ? 'dynasty' : 'conflict'],
                        gameAction: AbilityDsl.actions.returnToDeck({
                            location: Locations.Any,
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
