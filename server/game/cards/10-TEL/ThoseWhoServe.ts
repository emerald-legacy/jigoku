import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import {CardType, Duration, Phases} from '../../Constants.js';

class ThoseWhoServe extends DrawCard {
    static id = 'those-who-serve';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Reduce the cost of your characters by 1 this phase')
            .gameAction(ability.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    match: card => card.type === CardType.Character,
                    amount: 1,
                    costFloor: 1
                })
            })))
            .effect('reduce the cost of their characters by 1 this phase')
            .phase(Phases.Dynasty);
    }
}


export default ThoseWhoServe;
