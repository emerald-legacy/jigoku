import { CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class MantraOfWater extends DrawCard {
    static id = 'mantra-of-water';

    setupCardAbilities() {
        this.reaction('Ready a monk and draw a card')
            .when({
                onConflictDeclared: (event, context) =>
                    !!event.ring && event.ring.hasElement(Element.Water) && event.conflict.attackingPlayer === context.player.opponent
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card: DrawCard) => card.hasTrait('monk'))
            }, AbilityDsl.actions.ready())
            .gameAction(AbilityDsl.actions.draw())
            .effect('ready {0} and draw a card');
    }
}
