import { Players, Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { addElement, delayedEffect } from '../../effects.js';
import {
    optional,
    resolveRingEffect
} from '../../GameActions/GameActions.js';
import type { Element } from '../../Constants.js';

class StudyTheNaturalWorld extends DrawCard {
    static id = 'study-the-natural-world';

    setupCardAbilities() {
        this.action('Add elements to the conflict ring')
            .condition((context) => context.player.anyCardsInPlay((card) => card.isAttacking() && card.hasTrait(Trait.Scholar)))
            .ringLastingEffect((context) => ({
                target: context.game.currentConflict?.ring,
                effect: addElement(this.getElementsOfAttackedProvinces(context))
            }))
            .playerLastingEffect((context) => ({
                target: Players.Self,
                effect: delayedEffect({
                    when: {
                        afterConflict: (event) =>
                            context.player === event.conflict.winner
                    },
                    gameAction: optional({
                        activePromptTitle: 'Resolve Ring Effects?',
                        gameAction: resolveRingEffect(() => ({ target: (context.game.currentConflict?.ring?.getElements() ?? []).map((element) => context.game.rings[element]) })),
                        acceptMessage: () => msg`${context.player} chooses to resolve all elements of the contested ring due to the delayed effect of ${context.source}`
                    })
                })
            }))
            .chatText((context) => msg`add ${this.getElements(context)} to the conflict ring. They may resolve all elements if they win the conflict`);
    }

    private getElementsOfAttackedProvinces(context: AbilityContext): Element[] {
        let elements: Element[] = [];
        context.game.currentConflict?.getConflictProvinces().forEach((a) => {
            elements = elements.concat(a.getElement());
        });
        return elements;
    }

    private getElements(context: AbilityContext) {
        const capitalize: Record<string, string> = {
            air: 'Air',
            water: 'Water',
            earth: 'Earth',
            fire: 'Fire',
            void: 'Void'
        };

        let string = '';
        const elements = this.getElementsOfAttackedProvinces(context);
        for(let i = 0; i < elements.length; i++) {
            if(i !== 0) {
                if(i === elements.length - 1) {
                    string += ' and ';
                } else {
                    string += ', ';
                }
            }
            string += capitalize[elements[i]];
        }

        return string;
    }
}


export default StudyTheNaturalWorld;
