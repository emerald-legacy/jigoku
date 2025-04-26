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
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: (context.targets.enemy as DrawCard).traits.map((t) => AbilityDsl.effects.loseTrait(t))
                    }))
                }
            },
            effect: 'grant 2 military skill to {0} and removes traits from {1}',
            effectArgs: (context) => [context.targets.monk, context.targets.enemy]
        });
    }
}
