import { ProvinceCard } from '../../../ProvinceCard.js';
import { claimImperialFavor } from '../../../GameActions/GameActions.js';

export default class YatakabunePort extends ProvinceCard {
    static id = 'yatakabune-port';

    public setupCardAbilities() {
        this.interrupt('Claim the imperial favor')
            .when({
                onBreakProvince: (event, context) => event.card === context.source && context.game.isDuringConflict()
            })
            .gameAction(claimImperialFavor((context) => ({
                target: context.player
            })));
    }
}
