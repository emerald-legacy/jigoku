import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class EbbAndFlow extends DrawCard {
    static id = 'ebb-and-flow';

    public setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s skills',
            condition: (context) => context.game.isDuringConflict(),
            targets: {
                mine: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating() && card.hasTrait('shugenja'),
                    gameAction: AbilityDsl.actions.noAction()
                },
                opponents: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating() && !card.hasDash(),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.switchBaseSkills()
                    })
                }
            },
            effect: 'switch {1}\'s military and political skill',
            effectArgs: context => [context.targets.opponents],
            then: context => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    promptTitleForConfirmingAffinity: 'Swap abilities?',
                    effect: 'swap the abilities of {0} and {1}',
                    effectArgs: () => [context.targets.mine, context.targets.opponents],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.cardLastingEffect({
                            target: context.targets.mine,
                            effect: [
                                AbilityDsl.effects.blank(),
                                AbilityDsl.effects.gainAllAbilities(context.targets.opponents, true)
                            ],
                            duration: Durations.UntilEndOfConflict
                        }),
                        AbilityDsl.actions.cardLastingEffect({
                            target: context.targets.opponents,
                            effect: [
                                AbilityDsl.effects.blank(),
                                AbilityDsl.effects.gainAllAbilities(context.targets.mine, true)
                            ],
                            duration: Durations.UntilEndOfConflict
                        })
                    ])
                })

            })
        });
    }
}
