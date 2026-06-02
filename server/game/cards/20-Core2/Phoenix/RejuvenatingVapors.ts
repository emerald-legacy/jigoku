import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RejuvenatingVapors extends DrawCard {
    static id = 'rejuvenating-vapors';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    context.player.hasAffinity('water', context) || card.hasTrait('shugenja'),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
