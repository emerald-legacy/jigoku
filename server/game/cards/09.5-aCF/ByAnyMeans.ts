import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, SkillType } from '../../Constants.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { copyBaseSkillEffects } from '../copyBaseSkills.js';

class ByAnyMeans extends DrawCard {
    static id = 'by-any-means';

    setupCardAbilities() {
        this.action('Change base skill to match another character\'s')
            .condition((context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
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
            }, cardLastingEffect((context) => ({
                target: context.targets.myCharacter,
                effect: copyBaseSkillEffects(context.targets.oppCharacter, { skills: [SkillType.Military] })
            })))
            .chatText((context) => msg`set ${context.targets.myCharacter}'s base military skill to equal ${context.targets.oppCharacter}'s current military skill`);
    }
}


export default ByAnyMeans;
