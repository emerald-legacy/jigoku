import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class RighteousMagistrate extends DrawCard {
    static id = 'righteous-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            targetController: Players.Any,
            effect: [
                playerCannot({
                    cannot: RestrictionType.LoseHonor
                }),
                playerCannot({
                    cannot: RestrictionType.GainHonor
                }),
                playerCannot({
                    cannot: RestrictionType.TakeHonor
                })
            ]
        });
    }
}


export default RighteousMagistrate;
