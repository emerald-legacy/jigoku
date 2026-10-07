import { cannotTriggerAbilities } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class Tranquility extends DrawCard {
    static id = 'tranquility';

    public setupCardAbilities() {
        this.action('Opponent\'s characters at home can\'t use abilities')
            .condition((context) => this.game.isDuringConflict() && context.player.opponent !== undefined)
            .cardLastingEffect((context) => ({
                target: (context.player.opponent?.cardsInPlay ?? []).filter((card) => !card.isParticipating()),
                effect: cannotTriggerAbilities()
            }))
            .effect('stop characters at {1}\'s home from triggering abilities until the end of the conflict', (context) => context.player.opponent ?? '');
    }
}
