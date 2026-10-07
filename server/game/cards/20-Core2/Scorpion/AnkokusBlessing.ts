import { Location, Phases } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { draw, gainFate, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AnkokusBlessing extends DrawCard {
    static id = 'ankoku-s-blessing';

    setupCardAbilities() {
        this.action('Gain 2 fate and draw 2 cards')
            .cost(costs.discardCard({
                location: Location.Hand,
                cardCondition: (card) => !card.hasTrait('blessing')
            }))
            .gameAction(multipleContext((context) => ({
                gameActions: [
                    draw({ target: context.player, amount: 2 }),
                    gainFate({ target: context.player, amount: 2 })
                ]
            })))
            .effect('draw 2 cards and gain 2 fate')
            .max(perRound(1))
            .phase(Phases.Fate);
    }
}
