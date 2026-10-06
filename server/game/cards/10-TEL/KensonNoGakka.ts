import { ProvinceCard } from '../../ProvinceCard.js';
import { honor } from '../../GameActions/GameActions.js';

export default class KensonNoGakka extends ProvinceCard {
    static id = 'kenson-no-gakka';

    setupCardAbilities() {
        this.reaction('Honor all defenders')
            .when({
                afterConflict: (event, context) =>
                    context.source.isConflictProvince() && event.conflict.loser === context.player
            })
            .gameAction(honor((context) => ({
                target: context.game.currentConflict?.getDefenders()
            })));
    }
}
