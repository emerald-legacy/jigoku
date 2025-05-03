import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class LightningAscends extends DrawCard {
    static id = 'lightning-ascends';

    setupCardAbilities() {
        this.action({
            title: "Increase a monk's military skill and remove traits from an opponent",
            condition: (context) => context.game.isDuringConflict(),
            targets: {
                monk: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('monk'),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })
                },
                enemy: {
                    activePromptTitle: 'Choose a character to lose all traits',
                    dependsOn: 'monk',
                    cardType: CardTypes.Character,
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
