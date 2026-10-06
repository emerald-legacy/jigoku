import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { addToken, chosenReturnToDeck, draw, sequential } from '../../GameActions/GameActions.js';
import { EventName, TokenType } from '../../Constants.js';

class EndlessArchives extends DrawCard {
    static id = 'endless-archives';

    setupCardAbilities() {
        this.reaction('Place an honor token and draw cards')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .gameAction(addToken())
            .effect('place an honor token on {1} and exchange cards from their hand', context => [context.source])
            .then(() => ({
                gameAction: sequential([
                    chosenReturnToDeck(context => ({
                        target: context.player,
                        targets: false,
                        shuffle: false,
                        bottom: true,
                        amount: context.source.getTokenCount(TokenType.Honor)
                    })),
                    draw(context => ({
                        target: context.player,
                        amount: context.events.find((event) => event.is(EventName.OnCardMoved))?.cards?.length ?? 0
                    }))
                ])
            }))
            .limit(AbilityDsl.limit.unlimitedPerConflict())
            .anyPlayer();
    }
}


export default EndlessArchives;
