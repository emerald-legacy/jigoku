import AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

export default class MeekInformant extends DrawCard {
    static id = 'meek-informant';

    public setupCardAbilities() {
        this.reaction({
            title: 'Look at opponent\'s hand',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.player.opponent !== undefined
            },
            effect: 'look at {1}\'s hand',
            effectArgs: (context: AbilityContext) => context.player.opponent as any,
            gameAction: AbilityDsl.actions.lookAt((context: AbilityContext) => ({
                target: (context.player.opponent as Player).hand.slice().sort((a: any, b: any) => a.name.localeCompare(b.name)),
                chatMessage: true
            }))
        });
    }
}
