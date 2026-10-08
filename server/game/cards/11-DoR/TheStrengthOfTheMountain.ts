import DrawCard from '../../DrawCard.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class TheStrengthOfTheMountain extends DrawCard {
    static id = 'the-strength-of-the-mountain';

    setupCardAbilities() {
        this.conflictAction('Defending characters do not bow')
            .gameAction(cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: doesNotBow()
            })), cardLastingEffect((context) => ({
                target: context.game.currentConflict?.getDefenders(),
                effect: [
                    cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    }),
                    cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .chatText('prevent opponents\' actions from bowing or moving home defending characters, and stop them bowing at the end of the conflict');
    }
}


export default TheStrengthOfTheMountain;
