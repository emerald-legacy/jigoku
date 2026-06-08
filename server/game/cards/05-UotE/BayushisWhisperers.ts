import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';

class BayushisWhisperers extends DrawCard {
    static id = 'bayushi-s-whisperers';

    setupCardAbilities() {
        this.action({
            title: 'Look at opponent\'s hand and name a card',
            condition: context => !!(context.player.opponent && this.game.isDuringConflict()),
            effect: 'look at {1}\'s hand, then name a card',
            effectArgs: context => context.player.opponent as Player,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.lookAt(context => ({ target: context.player.opponent.hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)), chatMessage: true })),
                AbilityDsl.actions.handler({
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
            ])
        });
    }

    selectCardName(player: Player, cardName: string, context: AbilityContext) {
        this.game.addMessage('{0} names {1} - {2} cannot play copies of this card this phase', player, cardName, player.opponent);
        context.source.untilEndOfPhase((ability) => ({
            targetController: context.player.opponent,
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'copiesOfX',
                params: cardName
            })
        }));
        return true;
    }
}


export default BayushisWhisperers;
