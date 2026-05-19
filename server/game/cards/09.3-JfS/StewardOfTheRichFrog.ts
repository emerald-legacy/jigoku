import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StewardOfTheRichFrog extends DrawCard {
    static id = 'steward-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.player &&
                context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            targetController: Players.Self,
            match: (card) => card.getType() === CardTypes.Character,
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });
    }
}


export default StewardOfTheRichFrog;
