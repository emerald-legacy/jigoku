import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TokenType } from '../../Constants.js';
import type { Event } from '../../Events/Event.js';

class EndlessArchives extends DrawCard {
    static id = 'endless-archives';

    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token and draw cards',
            when: {
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            anyPlayer: true,
            gameAction: AbilityDsl.actions.addToken(),
            then: () => ({
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
                        amount: context.events.find((a: Event) => a.name === 'onCardMoved') ? (context.events.find((a: Event) => a.name === 'onCardMoved') as Event & { cards: DrawCard[] }).cards.length : 0
                    }))
                ])
            }),
            effect: 'place an honor token on {1} and exchange cards from their hand',
            effectArgs: context => [context.source]

        });
    }
}


export default EndlessArchives;
