import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class ShoshiNiKie extends DrawCard {
    static id = 'shoshi-ni-kie';

    setupCardAbilities() {
        this.action('ready an ordinary character')
            .cost(AbilityDsl.costs.selectedReveal({ cardCondition: card => card.isFacedown(), cardType: CardType.Province }))
            .target('target', {
                cardCondition: card => card.isOrdinary(),
                cardType: CardType.Character,
                player: Players.Self
            }, AbilityDsl.actions.ready());
    }
}


export default ShoshiNiKie;
