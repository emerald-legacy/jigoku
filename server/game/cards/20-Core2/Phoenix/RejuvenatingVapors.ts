import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RejuvenatingVapors extends DrawCard {
    static id = 'rejuvenating-vapors';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    context.player.hasAffinity('water', context) || card.hasTrait('shugenja'),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
