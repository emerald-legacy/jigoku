import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class Tranquility extends DrawCard {
    static id = 'tranquility';

    public setupCardAbilities() {
        this.action('Opponent\'s characters at home can\'t use abilities')
            .condition((context) => this.game.isDuringConflict() && context.player.opponent !== undefined)
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: (context.player.opponent?.cardsInPlay ?? []).filter((card: DrawCard) => !card.isParticipating()),
                effect: AbilityDsl.effects.cannotTriggerAbilities()
            })))
            .effect('stop characters at {1}\'s home from triggering abilities until the end of the conflict', (context) => context.player.opponent ?? '');
    }
}
