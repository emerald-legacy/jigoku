import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IkomaTsanuri2 extends DrawCard {
    static id = 'ikoma-tsanuri-2';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'triggerAbilities',
                restricts: 'attackedProvinceNonForced'
            })
        });
    }
}


export default IkomaTsanuri2;
