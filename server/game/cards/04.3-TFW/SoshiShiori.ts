import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { TargetModes } from '../../Constants.js';

class SoshiShiori extends DrawCard {
    static id = 'soshi-shiori';

    setupCardAbilities() {
        this.reaction ({
            title: 'Make opponent lose 1 honor',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            target: {
                mode: TargetModes.Select,
                activePromptTitle:'Choose a player to lose 1 honor',
                targets: true,
                choices: {
                    [this.owner.name]: AbilityDsl.actions.loseHonor({ target: this.owner }),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.loseHonor({ target: this.owner.opponent})
                }
            }
        });
    }
}

export default SoshiShiori;
