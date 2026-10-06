import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { CardType, AbilityType } from '../../Constants.js';

class CommandTheTributary extends DrawCard {
    static id = 'command-the-tributary';

    setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility(AbilityType.Action, {
                title: 'Move 1 fate to a character',
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) => card !== context.source,
                    gameAction: placeFate((context) => ({
                        origin: context.source.isDrawCard() ? context.source : undefined
                    }))
                }
            })
        });
    }
}


export default CommandTheTributary;
