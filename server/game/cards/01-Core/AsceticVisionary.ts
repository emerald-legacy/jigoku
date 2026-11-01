import { CardType, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AsceticVisionary extends DrawCard {
    static id = 'ascetic-visionary';

    override setupCardAbilities() {
        this.action('Ready a character')
            .condition((context) => context.source.isAttacking())
            .cost(costs.payFateToRing(1))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.hasTrait(Trait.Monk) || card.attachments.some((card) => card.hasTrait(Trait.Monk))
            }, ready());
    }
}
