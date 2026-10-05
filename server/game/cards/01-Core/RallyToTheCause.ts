import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class RallyToTheCause extends ProvinceCard {
    static id = 'rally-to-the-cause';

    setupCardAbilities() {
        this.reaction('Switch the conflict type')
            .when({
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .gameAction(AbilityDsl.actions.switchConflictType())
            .effect('switch the conflict type');
    }
}
