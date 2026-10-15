import DrawCard from '../../DrawCard.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class TheStrengthOfTheMountain extends DrawCard {
    static id = 'the-strength-of-the-mountain';

    setupCardAbilities() {
        this.conflictAction('Defending characters do not bow')
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: doesNotBow()
            }))
            .cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: [
                    cardCannot({
                        cannot: RestrictionType.SendHome,
                        appliesTo: RestrictionScope.OpponentsCardEffects,
                        applyingPlayer: context.player
                    }),
                    cardCannot({
                        cannot: RestrictionType.Bow,
                        appliesTo: RestrictionScope.OpponentsCardEffects,
                        applyingPlayer: context.player
                    })
                ]
            }))
            .chatText('prevent opponents\' actions from bowing or moving home defending characters, and stop them bowing at the end of the conflict');
    }
}


export default TheStrengthOfTheMountain;
