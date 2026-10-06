import { setMilitarySkill, setPoliticalSkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class WickedTetsubo extends DrawCard {
    static id = 'wicked-tetsubo';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'berserker'
        });

        this.action('Set Military or Political skill to 0')
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .target({
                name: 'character',
                activePromptTitle: 'Choose a defending character',
                cardType: CardType.Character,
                cardCondition: card => card.isDefending()
            })
            .select({
                name: 'effect',
                dependsOn: 'character',
                activePromptTitle: 'Choose a skill to set to 0'
            }, {
                'Military': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    effect: setMilitarySkill(0)
                })),
                'Political': cardLastingEffect((context) => ({
                    target: context.targets.character,
                    effect: setPoliticalSkill(0)
                }))
            })
            .effect('set {1}\'s {2} skill to 0', context => [context.targets.character, context.selects.effect.choice.toLowerCase()]);
    }
}


export default WickedTetsubo;
