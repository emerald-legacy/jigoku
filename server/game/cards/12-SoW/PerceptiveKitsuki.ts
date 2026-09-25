import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';

export default class PerceptiveKitsuki extends DrawCard {
    static id = 'perceptive-kitsuki';

    public setupCardAbilities() {
        this.action('Look at your opponent\'s hand')
            .cost(AbilityDsl.costs.returnRings(1))
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .gameAction(AbilityDsl.actions.lookAt((context) => ({
                target: (context.player.opponent?.hand ?? []).slice().sort((a: BaseCard, b: BaseCard) => a.name.localeCompare(b.name)),
                chatMessage: true
            })))
            .effect('look at {1}\'s hand', (context) => context.player.opponent ?? '');
    }
}
