import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AdvanceTowardsTheRear extends DrawCard {
    static id = 'advance-towards-the-rear';

    setupCardAbilities() {
        this.action({
            title: 'Move a character home',
            condition: () => this.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
