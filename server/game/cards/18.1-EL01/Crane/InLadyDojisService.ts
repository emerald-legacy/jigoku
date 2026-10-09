import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { cannotBeDeclaredAsAttacker, cannotBeDeclaredAsDefender } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class InLadyDojisService extends DrawCard {
    static id = 'in-lady-doji-s-service';

    setupCardAbilities() {
        this.action('Pacify a character')
            .cost(costs.bow({ cardType: CardType.Character }))
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Any
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Prevent Attacking': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [cannotBeDeclaredAsAttacker()]
                })),
                'Prevent Defending': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    duration: Duration.UntilEndOfPhase,
                    effect: [cannotBeDeclaredAsDefender()]
                }))
            })
            .chatText((context) => msg`prevent ${context.targets.character} from being declared as ${context.selects.select.choice === 'Prevent Attacking' ? 'an attacker' : 'a defender'} this phase`)
            .max(perRound(1));
    }
}
