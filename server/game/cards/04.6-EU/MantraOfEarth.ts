import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .gameAction(AbilityDsl.actions.draw())
            .effect('make {0} untargetable by opponents\' card effects and draw a card');
    }
}
