import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class MasashigisSacrifice extends DrawCard {
    static id = 'masashigi-s-sacrifice';

    setupCardAbilities() {
        this.action({
            title: 'Defending characters do not bow as a result of conflict resolution',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.hasStatusTokens
            }),
            condition: () => this.game.isDuringConflict(),
            gameAction: [
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.getDefenders(),
                    effect: AbilityDsl.effects.doesNotBow()
                }))
            ],
            effect: 'prevent defending characters from bowing at the end of a the conflict'
        });
    }
}


export default MasashigisSacrifice;
