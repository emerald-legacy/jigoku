import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RejuvenatingVapors extends DrawCard {
    static id = 'rejuvenating-vapors';

    setupCardAbilities() {
        this.action('Ready a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    context.player.hasAffinity('water', context) || card.hasTrait('shugenja')
            }, AbilityDsl.actions.ready());
    }
}
