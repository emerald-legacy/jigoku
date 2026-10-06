import { Players } from '../../Constants.js';
import { takeFate, takeHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class Levy extends DrawCard {
    static id = 'levy';

    public setupCardAbilities() {
        this.action('Take an honor or a fate from your opponent')
            .condition((context) => context.player.opponent !== undefined)
            .select({
                player: Players.Opponent
            }, {
                'Give your opponent 1 fate': takeFate(),
                'Give your opponent 1 honor': takeHonor()
            });
    }
}
