import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class ClarityOfPurpose extends DrawCard {
    static id = 'clarity-of-purpose';

    setupCardAbilities() {
        this.conflictAction('Character cannot be bowed and doesn\'t bow during political conflicts')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, cardLastingEffect({
                condition: () => this.game.isDuringConflict(ConflictType.Political),
                effect: doesNotBow()
            }), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: RestrictionType.Bow,
                    appliesTo: RestrictionScope.OpponentsCardEffects,
                    applyingPlayer: context.player
                })
            })))
            .chatText('prevent opponents\' actions from bowing {0} and stop it bowing at the end of a political conflict');
    }
}


export default ClarityOfPurpose;
