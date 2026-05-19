import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class FinalWhisper extends DrawCard {
    static id = 'final-whisper';

    setupCardAbilities() {
        this.reaction({
            title: 'Copy status token',
            when: {
                onStatusTokenGained: (event, context) =>
                    event.card.type === CardTypes.Character && event.card.controller === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller,
                gameAction: AbilityDsl.actions.gainStatusToken((context) => ({
                    token: context.event.token.grantedStatus || context.event.token
                }))
            }
        });
    }
}


export default FinalWhisper;
