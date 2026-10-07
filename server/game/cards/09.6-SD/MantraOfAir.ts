import { CardType, Element } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfAir extends DrawCard {
    static id = 'mantra-of-air';

    setupCardAbilities() {
        this.reaction('Honor a monk and draw a card')
            .when({
                onConflictDeclared: (event, context) =>
                    !!event.ring && event.ring.hasElement(Element.Air) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk'))
            }, honor())
            .draw()
            .effect('honor {0} and draw a card');
    }
}
