import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import { copyBaseSkillEffects } from '../copyBaseSkills.js';
import { msg } from '../../GameChat.js';

class MyAncestorsStrength extends DrawCard {
    static id = 'my-ancestor-s-strength';

    setupCardAbilities() {
        this.action('Modify base military and political skills')
            .target({
                name: 'shugenja',
                activePromptTitle: 'Choose a shugenja character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shugenja') && card.isParticipating()
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
                effect: copyBaseSkillEffects(context.targets.ancestor)
            })))
            .chatText((context) => msg`set ${context.targets.shugenja}'s base skills to those of ${context.targets.ancestor}`);
    }
}


export default MyAncestorsStrength;
