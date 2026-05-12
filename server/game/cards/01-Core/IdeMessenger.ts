import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class IdeMessenger extends DrawCard {
    static id = 'ide-messenger';

    setupCardAbilities(ability) {
        this.action ({
            title: 'Move an ally to a conflict',
            cost: ability.costs.payFate(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}


export default IdeMessenger;
