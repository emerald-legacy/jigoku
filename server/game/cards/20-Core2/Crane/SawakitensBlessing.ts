import { CardType, Players, ConflictType, RestrictionType } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { cardCannot, doesNotBow } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SawakitensBlessing extends DrawCard {
    static id = 'sawakiten-s-blessing';

    setupCardAbilities() {
        this.conflictAction('Character doesn\'t bow during resolution', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, cardLastingEffect({
                condition: () => this.game.isDuringConflict(),
                effect: doesNotBow()
            }), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: RestrictionType.Bow,
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .chatText('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict')
            .max(perRound(1));
    }
}
