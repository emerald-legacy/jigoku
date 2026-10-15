import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType, RestrictionScope } from '../../Constants.js';

class WhiteHordeVanguard extends DrawCard {
    static id = 'white-horde-vanguard';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict() && context.game.conflictRecord.filter((record) => record.completed).length === 0,
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
