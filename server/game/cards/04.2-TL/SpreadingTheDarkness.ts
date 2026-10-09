import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, RestrictionType, RestrictionScope } from '../../Constants.js';

class SpreadingTheDarkness extends DrawCard {
    static id = 'spreading-the-darkness';

    setupCardAbilities() {
        this.action('Give a character +4/+0')
            .cost(costs.payHonor(2))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyMilitarySkill(4),
                    cardCannot({
                        cannot: RestrictionType.Target,
                        appliesTo: RestrictionScope.OpponentsCardEffects,
                        applyingPlayer: context.player
                    })
                ]
            })))
            .chatText((context) => msg`give ${context.chatTarget()} +4${'military'} and prevent them from being targeted by opponent's abilities`);
    }
}


export default SpreadingTheDarkness;
