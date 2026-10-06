import AbilityDsl from '../../abilitydsl.js';
import { draw } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class ProvingGround extends DrawCard {
    static id = 'proving-ground';

    setupCardAbilities() {
        this.reaction('Draw a card after winning a duel')
            .when({
                afterDuel: (event, context) => {
                    if(!event.winner) {
                        return false;
                    }
                    return event.winner.some((card) => card.controller === context.player);
                }
            })
            .gameAction(draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default ProvingGround;
