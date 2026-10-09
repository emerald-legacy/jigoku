import { ProvinceCard } from '../../ProvinceCard.js';

export default class KensonNoGakka extends ProvinceCard {
    static id = 'kenson-no-gakka';

    setupCardAbilities() {
        this.reaction('Honor all defenders')
            .when({
                afterConflict: (event, context) =>
                    context.source.isConflictProvince() && event.conflict.loser === context.player
            })
            .honor((context) => ({
                target: context.game.currentConflict?.getDefenders()
            }));
    }
}
