import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { TargetMode, CardType } from '../../Constants.js';

class WickedTetsubo extends DrawCard {
    static id = 'wicked-tetsubo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'berserker'
        });

        this.action({
            title: 'Set Military or Political skill to 0',
            condition: context => !!(context.source.parent && context.source.parent.isAttacking()),
            targets: {
                character: {
                    activePromptTitle: 'Choose a defending character',
                    cardType: CardType.Character,
                    cardCondition: card => card.isDefending()
                },
                effect: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    activePromptTitle: 'Choose a skill to set to 0',
                    choices: {
                        'Military': ability.actions.cardLastingEffect((context: AbilityContext) => ({
                            target: context.targets.character,
                            effect: ability.effects.setMilitarySkill(0)
                        })),
                        'Political': ability.actions.cardLastingEffect((context: AbilityContext) => ({
                            target: context.targets.character,
                            effect: ability.effects.setPoliticalSkill(0)
                        }))
                    }
                }
            },
            effect: 'set {1}\'s {2} skill to 0',
            effectArgs: context => [context.targets.character, context.selects.effect.choice.toLowerCase()]
        });
    }
}


export default WickedTetsubo;
