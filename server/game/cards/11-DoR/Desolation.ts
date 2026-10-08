import { Duration } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { blank } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class Desolation extends DrawCard {
    static id = 'desolation';

    public setupCardAbilities() {
        this.action('Blank opponent\'s provinces')
            .cost(costs.payHonor(2))
            .condition((context) => context.player.opponent !== undefined)
            .cardLastingEffect((context) => ({
                target: this.game.provinceCards.filter((a) => a.controller === context.player.opponent),
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .chatText('blank {1}\'s provinces until the end of the phase', (context) => context.player.opponent?.name ?? '');
    }
}
