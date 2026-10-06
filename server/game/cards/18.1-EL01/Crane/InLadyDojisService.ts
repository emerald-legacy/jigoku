import AbilityDsl from '../../../abilitydsl.js';
import { cannotBeDeclaredAsAttacker, cannotBeDeclaredAsDefender } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class InLadyDojisService extends DrawCard {
    static id = 'in-lady-doji-s-service';

    setupCardAbilities() {
        this.action('Pacify a character')
            .cost(AbilityDsl.costs.bow({ cardType: CardType.Character }))
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
            .effect('prevent {1} from being declared as {2} this phase', (context) => [
                context.targets.character,
                context.selects.select.choice === 'Prevent Attacking' ? 'an attacker' : 'a defender'
            ])
            .max(AbilityDsl.limit.perRound(1));
    }
}
