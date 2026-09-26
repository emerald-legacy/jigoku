import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Duration, Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExpertInterpreter extends DrawCard {
    static id = 'expert-interpreter';

    setupCardAbilities() {
        this.reaction('Prevent characters from entering play while contesting a ring')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .ringTarget('myRing', {
                ringCondition: () => true
            }, AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict !== null && this.game.currentConflict.ring === context.rings.myRing,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'enterPlay',
                    restricts: 'characters'
                })
            })))
            .ringTarget('oppRing', {
                player: Players.Opponent,
                optional: true,
                hideIfNoLegalTargets: true,
                ringCondition: (_ring, context) => !!(context && context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict !== null && this.game.currentConflict.ring === context.rings.oppRing,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'enterPlay',
                    restricts: 'characters'
                })
            })))
            .effect('prevent characters from entering play while the {1} is contested{2}', context => [context.rings.myRing, this.buildString(context)]);
    }

    buildString(context: AbilityContext) {
        const opponent = context.player.opponent;
        if(opponent && context.rings.oppRing && !Array.isArray(context.rings.oppRing)) {
            let ring = context.rings.oppRing;
            return '.  ' + opponent.name + ' gives ' + context.player.name + ' 1 honor to also apply this effect to the ' + ring.name;
        }
        return '';
    }
}


export default ExpertInterpreter;
