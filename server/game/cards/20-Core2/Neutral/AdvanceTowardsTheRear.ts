import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AdvanceTowardsTheRear extends DrawCard {
    static id = 'advance-towards-the-rear';

    setupCardAbilities() {
        this.action('Move a character home')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(() => this.game.isDuringConflict('military'))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.sendHome());
    }
}
