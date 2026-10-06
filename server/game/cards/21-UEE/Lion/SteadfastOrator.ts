import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SteadfastOrator extends DrawCard {
    static id = 'steadfast-orator';

    setupCardAbilities() {
        this.reaction('Move the character back to the conflict')
            .when({
                onSendHome: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player
            })
            .cost(AbilityDsl.costs.chooseOne({
                'Discard a card from your hand': AbilityDsl.costs.discardCard(),
                'Discard the Imperial Favor': AbilityDsl.costs.discardImperialFavor()
            }))
            .cannotBeMirrored()
            .gameAction(moveToConflict((context) => ({ target: context.event.card })))
            .limit(AbilityDsl.limit.perRound(1));
    }
}
