import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';

export default class MeekInformant extends DrawCard {
    static id = 'meek-informant';

    public override setupCardAbilities() {
        this.reaction('Look at opponent\'s hand')
            .when({
                onCardPlayed: (event, context) => event.card === context.source && context.player.opponent !== undefined
            })
            .lookAt((context) => ({
                target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name))
            }))
            .chatText((context) => msg`look at ${context.player.opponent}'s hand`);
    }
}
