import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class MatsuMitsuko extends DrawCard {
    static id = 'matsu-mitsuko';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            condition: context => this.game.isDuringConflict('military') && context.player && context.player.opponent && context.player.isMoreHonorable(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default MatsuMitsuko;
