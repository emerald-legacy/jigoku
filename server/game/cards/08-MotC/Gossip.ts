import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { PlayType } from '../../Constants.js';

class Gossip extends DrawCard {
    static id = 'gossip';

    setupCardAbilities() {
        this.action({
            title: 'Name a card that your opponent cannot play for the phase',
            handler: context => {
                this.game.promptWithMenu(context.player, this, {
                    context: context,
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                        ]
                    }
                });
            }
        });
    }

    selectCardName(player: Player, cardName: string, context: AbilityContext) {
        this.game.addMessage('{0} names {1} - {2} cannot play copies of this card this phase', player, cardName, player.opponent);
        context.source.untilEndOfPhase((ability: any) => ({
            targetController: context.player.opponent,
            effect: ability.effects.playerCannot({
                cannot: PlayType.PlayFromHand,
                restricts: 'copiesOfX',
                source: context.source,
                params: cardName
            })
        }));
        return true;
    }
}

export default Gossip;

