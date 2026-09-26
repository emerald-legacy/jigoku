import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class WickedTetsubo extends DrawCard {
    static id = 'wicked-tetsubo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'berserker'
        });

        this.action('Set Military or Political skill to 0')
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .target('character', {
                activePromptTitle: 'Choose a defending character',
                cardType: CardType.Character,
                cardCondition: card => card.isDefending()
            })
            .select('effect', {
                dependsOn: 'character',
                activePromptTitle: 'Choose a skill to set to 0'
            }, {
                'Military': ability.actions.cardLastingEffect((context) => ({
                    target: context.targets.character,
                    effect: ability.effects.setMilitarySkill(0)
                })),
                'Political': ability.actions.cardLastingEffect((context) => ({
                    target: context.targets.character,
                    effect: ability.effects.setPoliticalSkill(0)
                }))
            })
            .effect('set {1}\'s {2} skill to 0', context => [context.targets.character, context.selects.effect.choice.toLowerCase()]);
    }
}


export default WickedTetsubo;
