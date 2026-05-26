import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiChallenger extends DrawCard {
    static id = 'doji-challenger';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}


export default DojiChallenger;
