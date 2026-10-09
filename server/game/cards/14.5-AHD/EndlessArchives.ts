import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { addToken, chosenReturnToDeck, draw, sequential } from '../../GameActions/GameActions.js';
import { EventName, TokenType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class EndlessArchives extends DrawCard {
    static id = 'endless-archives';

    setupCardAbilities() {
        this.reaction('Place an honor token and draw cards')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .gameAction(addToken())
            .chatText((context) => msg`place an honor token on ${context.source} and exchange cards from their hand`)
            .limit(unlimitedPerConflict())
            .anyPlayer()
            .then()
            .gameAction(sequential([
                chosenReturnToDeck((context) => ({
                    target: context.player,
                    targets: false,
                    shuffle: false,
                    bottom: true,
                    amount: context.source.getTokenCount(TokenType.Honor)
                })),
                draw((context) => ({
                    target: context.player,
                    amount: context.events.find((event) => event.is(EventName.OnCardMoved))?.cards?.length ?? 0
                }))
            ]));
    }
}


export default EndlessArchives;
