import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities() {
        this.action({
            title: 'Move a character to the conflict',
            condition: (context: AbilityContext) =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                !!context.player.opponent &&
                this.game.currentConflict.hasMoreParticipants(context.player.opponent, () => true),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [
                    AbilityDsl.actions.moveToConflict(),
                    AbilityDsl.actions.honor((context: AbilityContext) => ({ target: (context.target as DrawCard).hasTrait('commander') ? context.target : [] }))
                ]
            }
        });
    }
}


export default EvenTheOdds;
