import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MasterOfTheSpear extends DrawCard {
    static id = 'master-of-the-spear';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send home character',
            condition: () => this.isAttacking(),
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default MasterOfTheSpear;
