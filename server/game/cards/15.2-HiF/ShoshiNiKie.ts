import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

class ShoshiNiKie extends DrawCard {
    static id = 'shoshi-ni-kie';

    setupCardAbilities() {
        this.action({
            title: 'ready an ordinary character',
            cost: AbilityDsl.costs.selectedReveal({ cardCondition: card => card.isFacedown(), cardType: CardTypes.Province }),
            target: {
                cardCondition: card => card.isOrdinary(),
                cardType: CardTypes.Character,
                player: Players.Self,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default ShoshiNiKie;
