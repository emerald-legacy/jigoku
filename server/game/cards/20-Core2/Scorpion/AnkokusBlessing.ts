import { Location, Phase } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { draw, gainFate, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AnkokusBlessing extends DrawCard {
    static id = 'ankoku-s-blessing';

    setupCardAbilities() {
        this.action('Gain 2 fate and draw 2 cards')
            .phase(Phase.Fate)
            .cost(costs.discardCard({
                location: Location.Hand,
                cardCondition: (card) => !card.hasTrait('blessing')
            }))
            .gameAction(multiple((context) => [
                draw({ target: context.player, amount: 2 }),
                gainFate({ target: context.player, amount: 2 })
            ]))
            .chatText('draw 2 cards and gain 2 fate')
            .max(perRound(1));
    }
}
