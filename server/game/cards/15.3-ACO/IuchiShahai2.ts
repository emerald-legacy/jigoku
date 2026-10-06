import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { addKeyword } from '../../effects.js';
import { placeFate } from '../../GameActions/GameActions.js';

class IuchiShahai2 extends DrawCard {
    static id = 'iuchi-shahai-2';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => this.game.getFirstPlayer() === context.player,
            effect: addKeyword('covert')
        });

        this.reaction('Place 1 fate on this character')
            .when({
                onCardPlayed: (event, context) => (event.card.hasTrait('meishodo') || event.card.hasTrait('maho')) && event.player === context.player
            })
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(placeFate());
    }
}


export default IuchiShahai2;
