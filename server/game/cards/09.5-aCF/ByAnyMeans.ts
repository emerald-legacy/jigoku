import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { copyBaseSkillEffects } from '../copyBaseSkills.js';

class ByAnyMeans extends DrawCard {
    static id = 'by-any-means';

    setupCardAbilities() {
        this.action('Change base skill to match another character\'s')
            .condition(context => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target({
                name: 'myCharacter',
                activePromptTitle: 'Choose a bushi character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi')
            })
            .target({
                name: 'oppCharacter',
                dependsOn: 'myCharacter',
                activePromptTitle: 'Choose an opponent\'s character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect(context => ({
                target: context.targets.myCharacter,
                effect: copyBaseSkillEffects(context.targets.oppCharacter, { skills: ['military'] })
            })))
            .effect('set {1}\'s base military skill to equal {2}\'s current military skill', context => [context.targets.myCharacter, context.targets.oppCharacter]);
    }
}


export default ByAnyMeans;
