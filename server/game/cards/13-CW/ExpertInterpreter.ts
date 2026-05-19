import DrawCard from '../../drawcard.js';
import { Durations, Players, TargetModes, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExpertInterpreter extends DrawCard {
    static id = 'expert-interpreter';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent characters from entering play while contesting a ring',
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(),
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            targets: {
                myRing: {
                    mode: TargetModes.Ring,
                    ringCondition: () => true,
                    gameAction: AbilityDsl.actions.ringLastingEffect(context => ({
                        duration: Durations.UntilEndOfPhase,
                        targetController: Players.Any,
                        condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.rings.myRing,
                        effect: AbilityDsl.effects.playerCannot({
                            cannot: 'enterPlay',
                            restricts: 'characters'
                        })
                    }))
                },
                oppRing: {
                    player: Players.Opponent,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    mode: TargetModes.Ring,
                    ringCondition: (ring, context) => context.costs.optionalHonorTransferFromOpponentCostPaid,
                    gameAction: AbilityDsl.actions.ringLastingEffect(context => ({
                        duration: Durations.UntilEndOfPhase,
                        targetController: Players.Any,
                        condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.rings.oppRing,
                        effect: AbilityDsl.effects.playerCannot({
                            cannot: 'enterPlay',
                            restricts: 'characters'
                        })
                    }))
                }
            },
            effect: 'prevent characters from entering play while the {1} is contested{2}',
            effectArgs: context => [context.rings.myRing, this.buildString(context)]
        });
    }

    buildString(context) {
        if(context.rings.oppRing && !Array.isArray(context.rings.oppRing)) {
            let ring = context.rings.oppRing;
            return '.  ' + context.player.opponent.name + ' gives ' + context.player.name + ' 1 honor to also apply this effect to the ' + ring.name;
        }
        return '';
    }
}


export default ExpertInterpreter;
