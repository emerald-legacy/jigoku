import { CardType, Element } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect, draw } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfEarth extends DrawCard {
    static id = 'mantra-of-earth';

    setupCardAbilities() {
        this.reaction('Make a monk untargetable by opponents\' card effects and draw a card')
            .when({
                onConflictDeclared: (event, context) =>
                    event.ring?.hasElement(Element.Earth) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk'))
            }, cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .gameAction(draw())
            .effect('make {0} untargetable by opponents\' card effects and draw a card');
    }
}
