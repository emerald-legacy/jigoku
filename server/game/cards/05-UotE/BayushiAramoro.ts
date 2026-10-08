import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { delayedEffect, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, discardFromPlay } from '../../GameActions/GameActions.js';
import { Players, CardType, ConflictType } from '../../Constants.js';

class BayushiAramoro extends DrawCard {
    static id = 'bayushi-aramoro';

    setupCardAbilities() {
        this.action('Give a character -2/-0')
            .cost(costs.dishonorSelf())
            .condition((context) => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyMilitarySkill(-2),
                    delayedEffect({
                        condition: () => context.target.militarySkill < 1,
                        message: '{0} is discarded due to {1}\'s lasting effect',
                        messageArgs: [context.target, context.source],
                        gameAction: discardFromPlay()
                    })
                ]
            })))
            .effect('reduce {0}\'s military skill by 2 - they will die if they reach 0');
    }
}


export default BayushiAramoro;
