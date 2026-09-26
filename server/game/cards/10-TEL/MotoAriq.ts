import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class MotoAriq extends DrawCard {
    static id = 'moto-ariq';

    setupCardAbilities() {
        this.action('Move a ready character to the conflict')
            .condition(context => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.opponent.isMoreHonorable()))
            .target('target', {
                player: Players.Opponent,
                cardCondition: card => !card.bowed,
                cardType: CardType.Character,
                activePromptTitle: 'Choose a character to move to the conflict',
                controller: Players.Opponent
            }, AbilityDsl.actions.moveToConflict());
    }
}


export default MotoAriq;
