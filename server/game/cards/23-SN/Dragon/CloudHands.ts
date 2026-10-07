import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { cardLastingEffect, honor, multiple } from '../../../GameActions/GameActions.js';
import { copyBaseSkillEffects } from '../../copyBaseSkills.js';

export default class CloudHands extends DrawCard {
    static id = 'cloud-hands';

    setupCardAbilities() {
        this.conflictAction('Change base skill to match another character\'s')
            .target({
                name: 'myCharacter',
                activePromptTitle: 'Choose a monk character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            })
            .target({
                name: 'oppCharacter',
                dependsOn: 'myCharacter',
                activePromptTitle: 'Choose an opponent\'s character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, multiple([
                cardLastingEffect(context => ({
                    target: context.targets.myCharacter,
                    effect: copyBaseSkillEffects(context.targets.oppCharacter, { base: true })
                })),
                honor(context => ({
                    target: context.targets.myCharacter
                }))
            ]))
            .effect('honor {1} and set their base skills to equal {2}\'s base skills', context => [context.targets.myCharacter, context.targets.oppCharacter])
            .max(perConflict(1));
    }
}
