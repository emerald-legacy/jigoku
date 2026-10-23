import { CardType, Duration, ConflictType, Phase } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { additionalConflict } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { extraConflictPossible } from '../../extraConflictPossible.js';
import { msg } from '../../../GameChat.js';

export default class YogoNorio extends DrawCard {
    static id = 'yogo-norio';

    override setupCardAbilities() {
        this.action('Gain another political conflict')
            .condition((context) => context.game.currentPhase === Phase.Conflict && extraConflictPossible(context.player))
            .cost(costs.sacrifice({
                cardType: CardType.Character
            }))
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            })
            .chatText((context) => msg`allow ${context.player} to declare an additional political conflict this phase`);
    }
}
