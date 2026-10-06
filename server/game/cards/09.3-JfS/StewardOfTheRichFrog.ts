import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { cannotReceiveDishonorToken } from '../../effects.js';

class StewardOfTheRichFrog extends DrawCard {
    static id = 'steward-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            targetController: Players.Self,
            match: (card) => card.getType() === CardType.Character,
            effect: cannotReceiveDishonorToken()
        });
    }
}


export default StewardOfTheRichFrog;
