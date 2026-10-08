import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';

export default class GoblinSneak extends DrawCard {
    static id = 'goblin-sneak';

    public setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                onCharacterEntersPlay: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .placeFate((context) => ({
                origin: context.player.opponent
            }))
            .chatText((context) => msg`take a fate from ${context.player.opponent ?? ''} and place it on ${context.chatTarget()}`);
    }
}
