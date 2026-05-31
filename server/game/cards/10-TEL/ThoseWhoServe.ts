import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import {CardTypes, Durations, Phases} from '../../Constants.js';

class ThoseWhoServe extends DrawCard {
    static id = 'those-who-serve';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Reduce the cost of your characters by 1 this phase',
            phase: Phases.Dynasty,
            effect: 'reduce the cost of their characters by 1 this phase',
            gameAction: ability.actions.playerLastingEffect((context: any) => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    match: (card: any) => card.type === CardTypes.Character,
                    amount: 1,
                    costFloor: 1
                })
            }))
        });
    }
}


export default ThoseWhoServe;
