import { CardType, ConflictType, RestrictionType, RestrictionScope } from '../../Constants.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class KakitasFinalStance extends DrawCard {
    static id = 'kakita-s-final-stance';

    public setupCardAbilities() {
        const duelParticipants = DuelsThisConflict.participants(this.game);
        this.conflictAction('Character cannot be bowed and doesn\'t bow during resolution', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                condition: () => duelParticipants.has(context.target),
                effect: doesNotBow()
            })), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: RestrictionType.Bow,
                    appliesTo: RestrictionScope.OpponentsCardEffects,
                    applyingPlayer: context.player
                })
            })))
            .chatText('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict if it is involved in a duel');
    }
}
