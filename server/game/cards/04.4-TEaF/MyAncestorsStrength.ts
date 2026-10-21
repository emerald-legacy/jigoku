import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, Trait, SkillType } from '../../Constants.js';
import { copyBaseSkillEffects } from '../copyBaseSkills.js';
import { msg } from '../../GameChat.js';

class MyAncestorsStrength extends DrawCard {
    static id = 'my-ancestor-s-strength';

    override setupCardAbilities() {
        this.action('Modify base military and political skills')
            .target({
                name: 'shugenja',
                activePromptTitle: 'Choose a shugenja character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Shugenja) && card.isParticipating()
            })
            .target({
                name: 'ancestor',
                dependsOn: 'shugenja',
                activePromptTitle: 'Choose a character to copy from',
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self
            }, cardLastingEffect((context) => ({
                target: context.targets.shugenja,
                // a dash stays a dash (ruling #484)
                effect: copyBaseSkillEffects(context.targets.ancestor, {
                    skills: [SkillType.Military, SkillType.Political].filter((type) => !context.targets.shugenja.hasDash(type))
                })
            })))
            .chatText((context) => msg`set ${context.targets.shugenja}'s base skills to those of ${context.targets.ancestor}`);
    }
}


export default MyAncestorsStrength;
