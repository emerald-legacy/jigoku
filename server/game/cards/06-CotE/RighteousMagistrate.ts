import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RighteousMagistrate extends DrawCard {
    static id = 'righteous-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            targetController: Players.Any,
            effect: [
                AbilityDsl.effects.playerCannot({
                    cannot: 'loseHonor'
                }),
                AbilityDsl.effects.playerCannot({
                    cannot: 'gainHonor'
                }),
                AbilityDsl.effects.playerCannot({
                    cannot: 'takeHonor'
                })
            ]
        });
    }
}


export default RighteousMagistrate;
