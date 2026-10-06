import DrawCard from '../../DrawCard.js';
import { gainStatusToken } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';
import { StatusToken } from '../../StatusToken.js';

class FinalWhisper extends DrawCard {
    static id = 'final-whisper';

    setupCardAbilities() {
        this.reaction('Copy status token')
            .when({
                onStatusTokenGained: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller
            }, gainStatusToken((context) => ({
                token: context.event.token instanceof StatusToken ? context.event.token.grantedStatus : context.event.token
            })));
    }
}


export default FinalWhisper;
