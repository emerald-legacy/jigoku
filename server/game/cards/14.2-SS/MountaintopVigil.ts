import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, Players } from '../../Constants.js';

class MountaintopVigil extends DrawCard {
    static id = 'mountaintop-vigil';

    setupCardAbilities() {
        this.action({
            title: 'cancel all ring effects',
            effect: 'cancel all ring effects until the end of the conflict',
            condition: () => this.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Duration.UntilEndOfConflict,
                targetController: Players.Any,
                effect: AbilityDsl.effects.cannotResolveRings()
            })
        });
    }
}


export default MountaintopVigil;
