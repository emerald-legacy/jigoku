import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class WhiteHordeVanguard extends DrawCard {
    static id = 'white-horde-vanguard';

    override setupCardAbilities() {
        this.persistentEffect({
            // the first conflict lasts until it ends, also after its own record is completed (afterConflict reactions)
            condition: (context) => context.game.isDuringConflict() &&
                !context.game.conflictRecord.some((record) => record.completed && record.uuid !== context.game.currentConflict?.uuid),
            effect: [
                cardCannot({
                    cannot: RestrictionType.SendHome,
                    appliesTo: RestrictionScope.OpponentsCardEffects
                }),
                cardCannot({
                    cannot: RestrictionType.MoveToConflict,
                    appliesTo: RestrictionScope.OpponentsCardEffects
                }),
                cardCannot({
                    cannot: RestrictionType.Bow,
                    appliesTo: RestrictionScope.OpponentsCardEffects
                })
            ]
        });
    }
}


export default WhiteHordeVanguard;
