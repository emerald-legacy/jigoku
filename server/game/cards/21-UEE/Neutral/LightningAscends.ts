import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class LightningAscends extends DrawCard {
    static id = 'lightning-ascends';

    setupCardAbilities() {
        this.action({
            title: 'Increase a monk\'s military skill and remove traits from an opponent',

            targets: {
                monk: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('monk'),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })
                },
                enemy: {
                    activePromptTitle: 'Choose a character to lose all traits',
                    dependsOn: 'monk',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: (context.targets.enemy as DrawCard).traits.map((t) => AbilityDsl.effects.loseTrait(t))
                    }))
                }
            },
            effect: 'grant +2 {1} to {2} and removes all traits from {3}',
            effectArgs: (context) => ['military', context.targets.monk, context.targets.enemy]
        });
    }
}
