import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { RestrictionType } from '../../Constants.js';

class WhiteHordeVanguard extends DrawCard {
    static id = 'white-horde-vanguard';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict() && context.game.conflictRecord.filter((record) => record.completed).length === 0,
            effect: [
                cardCannot({
                    cannot: RestrictionType.SendHome,
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: RestrictionType.MoveToConflict,
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: RestrictionType.Bow,
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}


export default WhiteHordeVanguard;
