import DrawCard from '../../drawcard.js';
import { TargetModes } from '../../Constants.js';

class SoshiShiori extends DrawCard {
    static id = 'soshi-shiori';

    setupCardAbilities(ability) {
        this.reaction ({
            title: 'Make opponent lose 1 honor',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            target: {
                mode: TargetModes.Select,
                activePromptTitle:'Choose a player to lose 1 honor',
                targets: true,
                choices: {
                    [this.owner.name]: ability.actions.loseHonor({ target: this.owner }),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: ability.actions.loseHonor({ target: this.owner.opponent})
                }
            }
        });
    }
}

export default SoshiShiori;
