import DrawCard from '../../DrawCard.js';
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
                    cardCondition: (card, context) => card !== context.source,
                    gameAction: AbilityDsl.actions.placeFate((context) => ({
                        origin: context.source.isDrawCard() ? context.source : undefined
                    }))
                }
            })
        });
    }
}


export default CommandTheTributary;
