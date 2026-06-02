import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiChallenger extends DrawCard {
    static id = 'doji-challenger';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}


export default DojiChallenger;
