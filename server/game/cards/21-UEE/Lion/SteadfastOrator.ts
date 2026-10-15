import { CardType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class SteadfastOrator extends DrawCard {
    static id = 'steadfast-orator';

    override setupCardAbilities() {
        this.reaction('Move the character back to the conflict')
            .when({
                onSendHome: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player
            })
            .cost(costs.chooseOne({
                'Discard a card from your hand': costs.discardCard(),
                'Discard the Imperial Favor': costs.discardImperialFavor()
            }))
            .moveToConflict((context) => ({ target: context.event.card }))
            .cannotBeMirrored()
            .limit(perRound(1));
    }
}
