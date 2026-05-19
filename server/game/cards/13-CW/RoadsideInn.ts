import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes, Phases } from '../../Constants.js';

class RoadsideInn extends DrawCard {
    static id = 'roadside-inn';

    setupCardAbilities() {
        this.reaction({
            title: 'Place a fate on a character',
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(context => {
                return context.player.opponent.fate > 0;
            }),
            when: {
                onPhaseStarted: event => event.phase === Phases.Fate
            },
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.placeFate(context => ({ origin: context.player }))
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => context.costs.optionalHonorTransferFromOpponentCostPaid,
                    gameAction: AbilityDsl.actions.placeFate(context => ({ origin: context.player.opponent }))
                }
            },
            effect: 'place a fate from their pool on {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)]
        });
    }

    buildString(context) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + target.controller.name + ' gives ' + context.player.name + ' 1 honor to place a fate from their pool on ' + target.name;
        }
        return '';
    }
}


export default RoadsideInn;
