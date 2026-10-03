import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class Levy extends DrawCard {
    static id = 'levy';

    public setupCardAbilities() {
        this.action('Take an honor or a fate from your opponent')
            .condition((context) => context.player.opponent !== undefined)
            .select('target', {
                player: Players.Opponent
            }, {
                'Give your opponent 1 fate': AbilityDsl.actions.takeFate(),
                'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
            });
    }
}
