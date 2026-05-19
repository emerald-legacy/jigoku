import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, AbilityTypes } from '../../Constants.js';

class CommandTheTributary extends DrawCard {
    static id = 'command-the-tributary';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Move 1 fate to a character',
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => card !== context.source,
                    gameAction: AbilityDsl.actions.placeFate((context) => ({
                        origin: context.source,
                        amount: 1
                    }))
                }
            })
        });
    }
}


export default CommandTheTributary;
