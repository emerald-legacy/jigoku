import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class MasterOfTheSpear extends DrawCard {
    static id = 'master-of-the-spear';

    setupCardAbilities() {
        this.action('Send home character')
            .condition((context) => context.source.isAttacking())
            .target({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardType: CardType.Character,
                controller: Players.Opponent
            }, sendHome());
    }
}


export default MasterOfTheSpear;
