import { CardType, Duration, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfVoid extends DrawCard {
    static id = 'mantra-of-void';

    setupCardAbilities() {
        this.reaction({
            title: 'Reduce the cost to attach to a monk by 1',
            when: {
                onConflictDeclared: (event, context) =>
                    event.ring !== undefined && event.ring.hasElement(Element.Void) && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card: any) => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilEndOfConflict,
                    effect: AbilityDsl.effects.reduceCost({
                        amount: 1,
                        cardType: CardType.Attachment,
                        targetCondition: (target: any) => target === context.target
                    })
                }))
            },
            effect: 'reduce the cost of attachments they play on {0} this conflict by 1 and draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
