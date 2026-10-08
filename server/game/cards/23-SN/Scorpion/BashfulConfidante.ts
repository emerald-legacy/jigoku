import { msg } from '../../../GameChat.js';
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
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: additionalTriggerCostForCard(() => [giveHonorToTriggerCost(context.player)])
            })))
            .chatText((context) => msg`force ${context.player.opponent} to pay 1 honor to ${context.player} in order to trigger ${context.chatTarget()}'s abilities`);
    }
}
