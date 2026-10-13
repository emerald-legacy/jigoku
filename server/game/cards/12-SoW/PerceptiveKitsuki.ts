import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import DrawCard from '../../DrawCard.js';

export default class PerceptiveKitsuki extends DrawCard {
    static id = 'perceptive-kitsuki';

    public setupCardAbilities() {
        this.action('Look at your opponent\'s hand')
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .cost(costs.returnRings(1))
            .lookAt((context) => ({
                target: (context.player.opponent?.hand ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)),
                chatMessage: true
            }))
            .chatText((context) => msg`look at ${context.player.opponent ?? ''}'s hand`);
    }
}
