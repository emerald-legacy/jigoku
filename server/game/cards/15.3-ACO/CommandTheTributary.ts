import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, AbilityType } from '../../Constants.js';

class CommandTheTributary extends DrawCard {
    static id = 'command-the-tributary';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Move 1 fate to a character',
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: any, context: any) => card !== context.source,
                    gameAction: AbilityDsl.actions.placeFate((context: AbilityContext) => ({
                        origin: context.source,
                        amount: 1
                    }))
                }
            })
        });
    }
}


export default CommandTheTributary;
