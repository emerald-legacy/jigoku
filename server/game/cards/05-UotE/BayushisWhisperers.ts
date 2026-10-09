import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { handler, lookAt, sequential } from '../../GameActions/GameActions.js';
import { playerCannot } from '../../effects.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { RestrictionType } from '../../Constants.js';

class BayushisWhisperers extends DrawCard {
    static id = 'bayushi-s-whisperers';

    setupCardAbilities() {
        this.action('Look at opponent\'s hand and name a card')
            .condition((context) => !!(context.player.opponent && this.game.isDuringConflict()))
            .gameAction(sequential([
                lookAt((context) => ({ target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)), chatMessage: true })),
                handler({
                    handler: (context) => this.game.promptForCardName(context.player, (player, cardName) => this.forbidCopies(player, cardName, context))
                })
            ]))
            .chatText((context) => msg`look at ${context.player.opponent}'s hand, then name a card`);
    }

    private forbidCopies(player: Player, cardName: string, context: AbilityContext): void {
        this.game.addMessage(msg`${player} names ${cardName} - ${player.opponent} cannot play copies of this card this phase`);
        context.source.untilEndOfPhase({
            targetController: context.player.opponent,
            effect: playerCannot({
                cannot: RestrictionType.Play,
                restricts: 'copiesOfX',
                params: cardName
            })
        });
    }
}


export default BayushisWhisperers;
