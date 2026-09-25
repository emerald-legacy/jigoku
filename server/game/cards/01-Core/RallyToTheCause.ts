import { ProvinceCard } from '../../ProvinceCard.js';

export default class RallyToTheCause extends ProvinceCard {
    static id = 'rally-to-the-cause';

    setupCardAbilities() {
        this.reaction('Switch the conflict type')
            .when({
                onCardRevealed: (event, context) => event.card === context.source && this.game.isDuringConflict()
            })
            .handler(() => this.game.currentConflict?.switchType())
            .effect('switch the conflict type');
    }
}
