import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';

class WhiteHordeVanguard extends DrawCard {
    static id = 'white-horde-vanguard';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.game.conflictRecord.filter(record => record.completed).length === 0,
            effect: [
                cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: 'moveToConflict',
                    restricts: 'opponentsCardEffects'
                }),
                cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}


export default WhiteHordeVanguard;
