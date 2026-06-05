import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import {CardType, Duration, Phases} from '../../Constants.js';

class ThoseWhoServe extends DrawCard {
    static id = 'those-who-serve';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Reduce the cost of your characters by 1 this phase',
            phase: Phases.Dynasty,
            effect: 'reduce the cost of their characters by 1 this phase',
            gameAction: ability.actions.playerLastingEffect((context: AbilityContext) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    match: card => card.type === CardType.Character,
                    amount: 1,
                    costFloor: 1
                })
            }))
        });
    }
}


export default ThoseWhoServe;
