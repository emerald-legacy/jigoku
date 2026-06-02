import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Players, TargetMode } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Aranat extends DrawCard {
    static id = 'aranat';

    setupCardAbilities() {
        this.reaction({
            title: 'Place additional fate',
            when: {
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context: any) => context.player.opponent && event.card === context.source
            },
            effect: 'give {1} the opportunity to reveal provinces',
            effectArgs: (context: AbilityContext) => context.player.opponent ?? '',
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardType.Province,
                location: this.game.getProvinceArray(false),
                controller: Players.Opponent,
                player: Players.Opponent,
                optional: true,
                mode: TargetMode.Unlimited,
                cardCondition: (card: any) => card.isFacedown(),
                message: '{0} chooses to reveal {1}',
                messageArgs: (card: any, player: any) => [player, card],
                gameAction: AbilityDsl.actions.reveal()
            }),
            then: {
                message: '{3} has {4} facedown provinces so {4} fate is placed on {1}',
                messageArgs: (context: AbilityContext) => [context.player.opponent, context.player.getNumberOfOpponentsFacedownProvinces()],
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.placeFate((context: AbilityContext) => ({
                    target: context.source,
                    amount: context.player.getNumberOfOpponentsFacedownProvinces()
                }))
            }
        });
    }
}


export default Aranat;
