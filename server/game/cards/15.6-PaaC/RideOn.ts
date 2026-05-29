import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes, TargetModes } from '../../Constants.js';

class RideOn extends DrawCard {
    static id = 'ride-on';

    setupCardAbilities() {
        this.action({
            title: 'Move a character into or out of the conflict',
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('cavalry')
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    choices: {
                        'Move to conflict': AbilityDsl.actions.moveToConflict(context => ({ target: context.targets.character })),
                        'Move home': AbilityDsl.actions.sendHome(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default RideOn;
