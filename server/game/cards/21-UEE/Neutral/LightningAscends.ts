import { loseTrait, modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LightningAscends extends DrawCard {
    static id = 'lightning-ascends';

    setupCardAbilities() {
        this.action('Increase a monk\'s military skill and remove traits from an opponent')
            .target({
                name: 'monk',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .target({
                name: 'enemy',
                activePromptTitle: 'Choose a character to lose all traits',
                dependsOn: 'monk',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: context.targets.enemy.traits.map((t) => loseTrait(t))
            })))
            .effect('grant +2 {1} to {2} and remove all traits from {3}', (context) => ['military', context.targets.monk, context.targets.enemy]);
    }
}
