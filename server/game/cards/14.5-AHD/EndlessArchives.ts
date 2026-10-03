import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, TokenType } from '../../Constants.js';

class EndlessArchives extends DrawCard {
    static id = 'endless-archives';

    setupCardAbilities() {
        this.reaction('Place an honor token and draw cards')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .gameAction(AbilityDsl.actions.addToken())
            .effect('place an honor token on {1} and exchange cards from their hand', context => [context.source])
            .then(() => ({
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.chosenReturnToDeck(context => ({
                        target: context.player,
                        targets: false,
                        shuffle: false,
                        bottom: true,
                        amount: context.source.getTokenCount(TokenType.Honor)
                    })),
                    AbilityDsl.actions.draw(context => ({
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
