import * as costs from '../../../costs/index.js';
import { additionalConflict } from '../../../effects.js';
import { CardType, ConflictType, Duration, Phase } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class HeraldOfJustice extends DrawCard {
    static id = 'herald-of-justice';

    override setupCardAbilities() {
        this.action('Gain another military conflict')
            .condition((context) => context.game.currentPhase === Phase.Conflict)
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Military)
            })
            .chatText((context) => msg`allow ${context.player} to declare an additional military conflict this phase`);
    }
}
