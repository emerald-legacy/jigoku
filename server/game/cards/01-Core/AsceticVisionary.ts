import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class AsceticVisionary extends DrawCard {
    static id = 'ascetic-visionary';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.payFateToRing(1),
            condition: (context) => context.source.isAttacking(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) =>
                    card.hasTrait('monk') || card.attachments.some((card: any) => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
