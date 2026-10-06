import { CardType, Element } from '../../Constants.js';
import { draw, placeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfFire extends DrawCard {
    static id = 'mantra-of-fire';

    setupCardAbilities() {
        this.reaction('Add 1 fate to a monk and draw a card')
            .when({
                onConflictDeclared: (event, context) =>
                    event.ring?.hasElement(Element.Fire) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                cardCondition: card =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk'))
            }, placeFate())
            .gameAction(draw())
            .effect('add a fate to {0} and draw a card');
    }
}
