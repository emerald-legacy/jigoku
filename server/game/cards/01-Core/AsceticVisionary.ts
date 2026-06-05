import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class AsceticVisionary extends DrawCard {
    static id = 'ascetic-visionary';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.payFateToRing(1),
            condition: (context) => context.source.isAttacking(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card: DrawCard) => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
