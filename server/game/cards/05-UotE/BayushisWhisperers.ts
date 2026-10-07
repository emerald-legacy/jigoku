import DrawCard from '../../DrawCard.js';
import { handler, lookAt, sequential } from '../../GameActions/GameActions.js';
import { playerCannot } from '../../effects.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';

class BayushisWhisperers extends DrawCard {
    static id = 'bayushi-s-whisperers';

    setupCardAbilities() {
        this.action('Look at opponent\'s hand and name a card')
            .condition(context => !!(context.player.opponent && this.game.isDuringConflict()))
            .gameAction(sequential([
                lookAt(context => ({ target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)), chatMessage: true })),
                handler({
                    handler: context => this.game.promptWithMenu(context.player, this, {
                        context: context,
                        activePrompt: {
                            menuTitle: 'Name a card',
                            controls: [
                                { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                            ]
                        }
                    })
                })
            ]))
            .effect('look at {1}\'s hand, then name a card', context => context.player.opponent);
    }

    selectCardName(player: Player, cardName: string, context: AbilityContext) {
        this.game.addMessage('{0} names {1} - {2} cannot play copies of this card this phase', player, cardName, player.opponent);
        context.source.untilEndOfPhase({
            targetController: context.player.opponent,
            effect: playerCannot({
                cannot: 'play',
                restricts: 'copiesOfX',
                params: cardName
            })
        });
        return true;
    }
}


export default BayushisWhisperers;
