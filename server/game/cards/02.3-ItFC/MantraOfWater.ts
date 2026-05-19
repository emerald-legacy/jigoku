import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class MantraOfWater extends DrawCard {
    static id = 'mantra-of-water';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a monk and draw a card',
            when: {
                onConflictDeclared: (event, context) =>
                    event.ring.hasElement('water') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card) => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.ready()
            },
            effect: 'ready {0} and draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}
