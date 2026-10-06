import { CardType, Players } from '../../../Constants.js';
import { additionalTriggerCostForCard } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { giveHonorToTriggerCost } from '../../giveHonorToTriggerCost.js';

export default class BashfulConfidante extends DrawCard {
    static id = 'bashful-confidante';

    setupCardAbilities() {
        this.reaction('Pick a character to spend honor to use abilities')
            .when({
                onConflictStarted: (_, context) => context.source.isParticipating()
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect(context => ({
                effect: additionalTriggerCostForCard(() => [giveHonorToTriggerCost(context.player)])
            })))
            .effect('force {1} to pay 1 honor to {2} in order to trigger {0}\'s abilities', context => [context.player.opponent, context.player]);
    }
}
