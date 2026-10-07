import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { blank } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import { msg } from '../../../GameChat.js';

export default class UsogawaChidori extends DrawCard {
    static id = 'usogawa-chidori';

    setupCardAbilities() {
        this.action('Blank a character')
            .cost(costs.giveFateToOpponent())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.isParticipating()
            }, cardLastingEffect({
                effect: blank(),
                duration: Duration.UntilEndOfPhase
            }))
            .effect((context) => msg`treat ${context.target} as if it had no printed abilities until the end of the phase`);
    }
}
