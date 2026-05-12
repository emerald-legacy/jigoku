import DrawCard from '../../drawcard';
import { TargetModes } from '../../Constants';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: ability.limit.perRound(2),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Move into conflict': ability.actions.moveToConflict(context => ({ target: context.source })),
                    'Move home': ability.actions.sendHome(context => ({ target: context.source }))
                }
            }
        });
    }
}


export default MotoJuro;
