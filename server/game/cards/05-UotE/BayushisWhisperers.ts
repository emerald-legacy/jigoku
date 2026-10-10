import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { lookAt, nameCard, playerLastingEffect, sequential } from '../../GameActions/GameActions.js';
import { playerCannot } from '../../effects.js';
import { Duration, RestrictionType, RestrictionScope } from '../../Constants.js';

class BayushisWhisperers extends DrawCard {
    static id = 'bayushi-s-whisperers';

    setupCardAbilities() {
        this.action('Look at opponent\'s hand and name a card')
            .condition((context) => !!(context.player.opponent && this.game.isDuringConflict()))
            .gameAction(sequential([
                lookAt((context) => ({ target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)), chatMessage: true })),
                nameCard((context) => ({
                    message: (_context, cardName, player) => msg`${player} names ${cardName} - ${player.opponent} cannot play copies of this card this phase`,
                    gameAction: (cardName) => playerLastingEffect({
                        duration: Duration.UntilEndOfPhase,
                        targetController: context.player.opponent,
                        effect: playerCannot({
                            cannot: RestrictionType.Play,
                            appliesTo: RestrictionScope.CopiesOfX,
                            params: cardName
                        })
                    })
                }))
            ]))
            .chatText((context) => msg`look at ${context.player.opponent}'s hand, then name a card`);
    }
}


export default BayushisWhisperers;
