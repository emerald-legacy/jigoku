import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class MountaintopVigil extends DrawCard {
    static id = 'mountaintop-vigil';

    setupCardAbilities() {
        this.conflictAction('cancel all ring effects')
            .gameAction(AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.cannotResolveRings()
            }))
            .effect('cancel all ring effects until the end of the conflict');
    }
}


export default MountaintopVigil;
