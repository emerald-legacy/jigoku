import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { loseHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { playerChoices } from '../playerChoices.js';

class SoshiShiori extends DrawCard {
    static id = 'soshi-shiori';

    setupCardAbilities() {
        this.reaction('Make opponent lose 1 honor')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player
            })
            .selectFrom({
                activePromptTitle: 'Choose a player to lose 1 honor',
                targets: true
            }, (context) => playerChoices(context.player, (player) => loseHonor({ target: player })))
            .limit(unlimitedPerConflict());
    }
}

export default SoshiShiori;
