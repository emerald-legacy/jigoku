import * as costs from '../../costs/index.js';
import { lookAt } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class PerceptiveKitsuki extends DrawCard {
    static id = 'perceptive-kitsuki';

    public setupCardAbilities() {
        this.action('Look at your opponent\'s hand')
            .cost(costs.returnRings(1))
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .gameAction(lookAt((context) => ({
                target: (context.player.opponent?.hand ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)),
                chatMessage: true
            })))
            .chatText('look at {1}\'s hand', (context) => context.player.opponent ?? '');
    }
}
