import DrawCard from '../../DrawCard.js';
import { moveToConflict } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class MotoAriq extends DrawCard {
    static id = 'moto-ariq';

    setupCardAbilities() {
        this.action('Move a ready character to the conflict')
            .condition((context) => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.opponent.isMoreHonorable()))
            .target({
                player: Players.Opponent,
                cardCondition: (card) => !card.bowed,
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to move to the conflict',
                controller: Players.Opponent
            }, moveToConflict());
    }
}


export default MotoAriq;
