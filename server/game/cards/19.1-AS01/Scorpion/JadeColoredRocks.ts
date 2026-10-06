import { Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { discardAtRandom, loseFate, loseHonor } from '../../../GameActions/GameActions.js';

export default class JadeColoredRocks extends ProvinceCard {
    static id = 'jade-colored-rocks';

    public setupCardAbilities() {
        this.action('Make your opponent lose a resource')
            .select({
                player: Players.Self,
                activePromptTitle: 'Choose an option'
            }, {
                'Opponent loses 1 fate': loseFate(),
                'Opponent loses 1 honor': loseHonor((context) => ({
                    target: (context.player.opponent?.honor ?? 0) > 6 ? context.player.opponent : []
                })),
                'Opponent discards 1 card at random': discardAtRandom()
            });
    }
}
