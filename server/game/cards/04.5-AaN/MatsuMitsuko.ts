import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class MatsuMitsuko extends DrawCard {
    static id = 'matsu-mitsuko';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            condition: context => !!(this.game.isDuringConflict('military') && context.player && context.player.opponent && context.player.isMoreHonorable()),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default MatsuMitsuko;
