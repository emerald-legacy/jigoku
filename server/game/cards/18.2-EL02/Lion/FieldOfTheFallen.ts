import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { Location, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { conditional, draw, returnToDeck, selectCard, sequential } from '../../../GameActions/GameActions.js';

class FieldOfTheFallen extends DrawCard {
    static id = 'field-of-the-fallen';

    override setupCardAbilities() {
        this.conflictAction('Discard then draw a card', { conflictType: ConflictType.Military })
            .cost(costs.discardCard({ location: Location.Hand }))
            .gameAction(sequential([
                draw((context) => ({
                    target: context.player
                })),
                conditional({
                    condition: (context) => context.player.isMoreHonorable(),
                    trueGameAction: selectCard({
                        location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                        activePromptTitle: 'Select a card to place on the bottom of a deck',
                        message: (context, card) => msg`${context.player} places ${card} on the bottom of ${card.owner}'s ${card.isDynasty ? 'dynasty' : 'conflict'} deck`,
                        gameAction: returnToDeck({
                            location: Location.Any,
                            bottom: true
                        })
                    })
                })
            ]));
    }
}


export default FieldOfTheFallen;
