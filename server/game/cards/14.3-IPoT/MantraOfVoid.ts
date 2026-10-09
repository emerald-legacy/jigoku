import { CardType, Element } from '../../Constants.js';
import { reduceCost } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfVoid extends DrawCard {
    static id = 'mantra-of-void';

    setupCardAbilities() {
        this.reaction('Reduce the cost to attach to a monk by 1')
            .when({
                onConflictDeclared: (event, context) =>
                    event.ring !== undefined && event.ring.hasElement(Element.Void) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk'))
            }, playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceCost({
                    amount: 1,
                    cardType: CardType.Attachment,
                    targetCondition: (target) => target === context.target
                })
            })))
            .draw()
            .chatText('reduce the cost of attachments they play on {0} this conflict by 1 and draw a card');
    }
}
