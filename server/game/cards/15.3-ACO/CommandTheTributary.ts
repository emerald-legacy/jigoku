import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class CommandTheTributary extends DrawCard {
    static id = 'command-the-tributary';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.action('Move 1 fate to a character', (ability) => ability
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) => card !== context.source
                }, placeFate((context) => ({
                    origin: context.source.isDrawCard() ? context.source : undefined
                }))))
        });
    }
}


export default CommandTheTributary;
