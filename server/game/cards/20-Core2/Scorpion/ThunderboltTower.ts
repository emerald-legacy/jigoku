import { msg } from '../../../GameChat.js';
import { CardType, Duration } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class ThunderboltTower extends StrongholdCard {
    static id = 'thunderbolt-tower';

    setupCardAbilities() {
        this.action('Give a character -2/-2')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.isParticipating()
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: modifyBothSkills(-2)
            }))
            .chatText((context) => msg`give ${context.chatTarget()} -2${'military'}/-2${'political'} for the phase`);
    }
}
