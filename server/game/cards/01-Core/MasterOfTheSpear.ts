import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class MasterOfTheSpear extends DrawCard {
    static id = 'master-of-the-spear';

    setupCardAbilities(ability) {
        this.action({
            title: 'Send home character',
            condition: () => this.isAttacking(),
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default MasterOfTheSpear;
