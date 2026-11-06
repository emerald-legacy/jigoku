import { msg } from '../../../GameChat.js';
import { loseTrait, modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LightningAscends extends DrawCard {
    static id = 'lightning-ascends';

    override setupCardAbilities() {
        this.conflictAction('Increase a monk\'s military skill and remove traits from an opponent')
            .target({
                name: 'monk',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipatingFor(context.player) && card.hasTrait(Trait.Monk)
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .target({
                name: 'enemy',
                activePromptTitle: 'Choose a character to lose all traits',
                dependsOn: 'monk',
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent && card.isParticipatingFor(context.player.opponent)
            }, cardLastingEffect((context) => ({
                effect: [...context.targets.enemy.getTraits()].map((t) => loseTrait(t))
            })))
            .chatText((context) => msg`grant +2 ${'military'} to ${context.targets.monk} and remove all traits from ${context.targets.enemy}`);
    }
}
