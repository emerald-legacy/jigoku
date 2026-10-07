import DrawCard from '../../../DrawCard.js';
import { delayedEffect, modifyProvinceStrength } from '../../../effects.js';
import { conditional, gainHonor, playerLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, Phases, Duration } from '../../../Constants.js';

export default class ShaperOfStone extends DrawCard {
    static id = 'shaper-of-stone';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => !!context && card.type === CardType.Province && card.controller === context.player,
            effect: modifyProvinceStrength(1)
        });
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Opponent,
            match: (card, context) => !!context && card.type === CardType.Province && card.controller === context.player.opponent,
            effect: modifyProvinceStrength(-1)
        });

        this.reaction('Mark a province')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.location !== Location.StrongholdProvince
            }, playerLastingEffect((context) => ({
                effect: delayedEffect({
                    when: {
                        onPhaseEnded: (event) => event.phase === Phases.Conflict
                    },
                    message: '{0}{1}{2}',
                    messageArgs: () => context.target.isBroken ? ['', '', ''] : [context.player, ' gains 1 honor due to the delayed effect of ', context.source],
                    gameAction: conditional({
                        condition: () => !context.target.isBroken,
                        trueGameAction: gainHonor({
                            target: context.player
                        })
                    })
                }),
                duration: Duration.UntilEndOfRound
            })))
            .effect('mark {1} - they will gain 1 honor if the province remains unbroken at the end of the phase', context => context.target.facedown ? [context.target.location] : [context.target]);
    }
}
