import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class MasashigisSacrifice extends DrawCard {
    static id = 'masashigi-s-sacrifice';

    setupCardAbilities() {
        this.action('Defending characters do not bow as a result of conflict resolution')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens
            }))
            .condition(() => this.game.isDuringConflict())
            .gameAction(cardLastingEffect(context => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: doesNotBow()
            })))
            .effect('prevent defending characters from bowing at the end of the conflict');
    }
}


export default MasashigisSacrifice;
