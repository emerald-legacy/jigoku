import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class RighteousMagistrate extends DrawCard {
    static id = 'righteous-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            targetController: Players.Any,
            effect: [
                playerCannot({
                    cannot: 'loseHonor'
                }),
                playerCannot({
                    cannot: 'gainHonor'
                }),
                playerCannot({
                    cannot: 'takeHonor'
                })
            ]
        });
    }
}


export default RighteousMagistrate;
