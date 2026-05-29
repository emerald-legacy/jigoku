import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class MotoAriq extends DrawCard {
    static id = 'moto-ariq';

    setupCardAbilities() {
        this.action({
            title: 'Move a ready character to the conflict',
            condition: context => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.opponent.isMoreHonorable()),
            target: {
                player: Players.Opponent,
                cardCondition: card => !card.bowed,
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to move to the conflict',
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}


export default MotoAriq;
