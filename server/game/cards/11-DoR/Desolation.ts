import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class Desolation extends DrawCard {
    static id = 'desolation';

    public setupCardAbilities() {
        this.action('Blank opponent\'s provinces')
            .cost(AbilityDsl.costs.payHonor(2))
            .condition((context) => context.player.opponent !== undefined)
            .gameAction(cardLastingEffect((context) => ({
                target: this.game.provinceCards.filter(a => a.controller === context.player.opponent),
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            })))
            .effect('blank {1}\'s provinces until the end of the phase', (context) => context.player.opponent?.name ?? '');
    }
}
