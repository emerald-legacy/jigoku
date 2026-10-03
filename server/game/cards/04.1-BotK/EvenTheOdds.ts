import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition((context) =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                !!context.player.opponent &&
                this.game.currentConflict.hasMoreParticipants(context.player.opponent, () => true))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.moveToConflict(), AbilityDsl.actions.honor((context) => ({ target: context.target?.hasTrait('commander') ? context.target : [] })));
    }
}


export default EvenTheOdds;
