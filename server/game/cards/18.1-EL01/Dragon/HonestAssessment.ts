import AbilityDsl from '../../../abilitydsl.js';
import { EventName, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/shuffle.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class HonestAssessment extends DrawCard {
    static id = 'honest-assessment';

    setupCardAbilities() {
        this.attachmentConditions({ trait: 'courtier' });

        this.reaction({
            title: 'Name a card',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) =>
                    event.card === context.source && event.originalLocation !== Location.PlayArea
            },
            cost: AbilityDsl.costs.nameCard(),
            max: AbilityDsl.limit.perRound(1),
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const hand: Array<DrawCard> = shuffle(context.player.opponent?.hand ?? []);
                const cards = hand.slice(0, 4).sort((a, b) => a.name.localeCompare(b.name));
                return {
                    gameActions: [
                        AbilityDsl.actions.reveal({ target: cards, chatMessage: true, player: context.player.opponent }),
                        AbilityDsl.actions.discardMatching({
                            target: context.player.opponent,
                            cards,
                            amount: -1, //all
                            reveal: false,
                            match: (context, card) => card.name === context.costs.nameCardCost
                        })
                    ]
                };
            }),
            effect: 'reveal 4 random cards from {1}\'s hand and discard all copies of {2}',
            effectArgs: (context) => [context.player.opponent as any, context.costs.nameCardCost]
        });
    }
}
