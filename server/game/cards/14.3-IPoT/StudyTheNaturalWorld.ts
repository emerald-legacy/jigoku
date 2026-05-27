import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations, EventNames } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

class StudyTheNaturalWorld extends DrawCard {
    static id = 'study-the-natural-world';

    setupCardAbilities() {
        this.action({
            title: 'Add elements to the conflict ring',
            condition: (context: AbilityContext) => context.player.anyCardsInPlay((card: DrawCard) => card.isAttacking() && card.hasTrait('scholar')),
            effect: 'add {1} to the conflict ring. They may resolve all elements if they win the conflict',
            effectArgs: (context: AbilityContext) => [this.getElements(context)],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ringLastingEffect((context: AbilityContext) => ({
                    duration: Durations.UntilEndOfConflict,
                    target: context.game.currentConflict?.ring,
                    effect: AbilityDsl.effects.addElement(this.getElementsOfAttackedProvinces(context))
                })),
                AbilityDsl.actions.playerLastingEffect((context: AbilityContext) => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            afterConflict: (event: EventPayload<typeof EventNames.AfterConflict>) =>
                                context.player === event.conflict.winner
                        },
                        gameAction: AbilityDsl.actions.menuPrompt({
                            activePromptTitle: 'Resolve Ring Effects?',
                            choices: ['Yes', 'No'],
                            choiceHandler: (choice: string, displayMessage: boolean) => {
                                if(displayMessage && choice === 'Yes') {
                                    context.game.addMessage('{0} chooses to resolve all elements of the contested ring due to the delayed effect of {1}', context.player, context.source);
                                }
                                return { target: (choice === 'Yes' ? (context.game.currentConflict?.ring?.getElements() ?? []) : []) };
                            },
                            gameAction: AbilityDsl.actions.resolveRingEffect()
                        })
                    })
                }))
            ])
        });
    }

    getElementsOfAttackedProvinces(context: AbilityContext): string[] {
        let elements: string[] = [];
        context.game.currentConflict?.getConflictProvinces().forEach((a: ProvinceCard) => {
            elements = elements.concat(a.getElement());
        });
        return elements;
    }

    getElements(context: AbilityContext) {
        const capitalize: Record<string, string> = {
            air: 'Air',
            water: 'Water',
            earth: 'Earth',
            fire: 'Fire',
            void: 'Void'
        };

        let string = '';
        let elements = this.getElementsOfAttackedProvinces(context);
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
