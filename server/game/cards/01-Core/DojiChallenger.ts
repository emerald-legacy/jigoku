import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiChallenger extends DrawCard {
    static id = 'doji-challenger';

    setupCardAbilities() {
        this.action('Move a character into the conflict')
            .condition(context => context.source.isAttacking())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent
            }, AbilityDsl.actions.moveToConflict());
    }
}


export default DojiChallenger;
