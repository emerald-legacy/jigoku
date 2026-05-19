import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character to the conflict',
            condition: context => this.game.isDuringConflict() && this.game.currentConflict.hasMoreParticipants(context.player.opponent),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [
                    ability.actions.moveToConflict(),
                    ability.actions.honor(context => ({ target: context.target.hasTrait('commander') ? context.target : [] }))
                ]
            }
        });
    }
}


export default EvenTheOdds;
