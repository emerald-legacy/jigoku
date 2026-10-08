import { CardType, Duration, ConflictType, Phase } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { additionalConflict } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class YogoNorio extends DrawCard {
    static id = 'yogo-norio';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(costs.sacrifice({
                cardType: CardType.Character
            }))
            .condition((context) => context.game.currentPhase === Phase.Conflict)
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            }))
            .effect((context) => msg`allow ${context.player} to declare an additional political conflict this phase`);
    }
}
