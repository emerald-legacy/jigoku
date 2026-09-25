import AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';

export default class MeekInformant extends DrawCard {
    static id = 'meek-informant';

    public setupCardAbilities() {
        this.reaction('Look at opponent\'s hand')
            .when({
                onCardPlayed: (event, context) => event.card === context.source && context.player.opponent !== undefined
            })
            .gameAction(AbilityDsl.actions.lookAt((context) => ({
                target: (context.player.opponent as Player).hand.slice().sort((a, b) => a.name.localeCompare(b.name)),
                chatMessage: true
            })))
            .effect('look at {1}\'s hand', (context) => context.player.opponent);
    }
}
