import { ProvinceCard } from '../../ProvinceCard.js';
import { switchConflictType } from '../../GameActions/GameActions.js';

export default class RallyToTheCause extends ProvinceCard {
    static id = 'rally-to-the-cause';

    setupCardAbilities() {
        this.reaction('Switch the conflict type')
            .when({
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .gameAction(switchConflictType())
            .effect('switch the conflict type');
    }
}
