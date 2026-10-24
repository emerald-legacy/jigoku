import { msg } from '../../../GameChat.js';
import { perRound } from '../../../AbilityLimit.js';
import { cannotDeclareRing } from '../../../effects.js';
import { Duration, Element } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

function fluff(element: Element): string {
    switch(element) {
        case Element.Air:
            return 'with a glorious race they celebrate. A day of games and friendly competition, the herd and the samurai in communion';
        case Element.Earth:
            return 'high in the mountains they celebrate. Around a fire, close to the stars, sharing some tasty kumis';
        case Element.Fire:
            return 'it\'s a sunny day filled with celebration. The Moto share tales of the desert';
        case Element.Water:
            return 'they celebrate at the beach. A day of joyful play for the riders, and the first sight of the sea for a few foals';
        case Element.Void:
            return 'with offerings at an open air shrine they celebrate. The Iuchi pay respect to Shinjo-kami, and herd is blessed for a good year';
    }
}

export default class DayOfBrotherHorse extends DrawCard {
    static id = 'day-of-brother-horse';

    override setupCardAbilities() {
        this.reaction('Protect a ring and draw three cards')
            .when({
                onConflictPass: (event, context) =>
                    context.player === event.conflict.attackingPlayer &&
                    context.player.cardsInPlay.some((card) => !card.bowed)
            })
            .ringTarget({
                ringCondition: () => true
            })
            .ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.ring.getElements().map((element) => context.game.rings[element]),
                effect: cannotDeclareRing(
                    (player) => player === context.player.opponent
                )
            }))
            .draw(3)
            .chatText((context) => msg`prevent ${context.player.opponent ?? ''} from declaring ${context.chatTarget()} conflicts, draw 3 cards, and discard 1 card - ${fluff(context.ring.element)}`)
            .max(perRound(1))
            .then()
            .chosenDiscard((context) => ({ target: context.player }));
    }
}
