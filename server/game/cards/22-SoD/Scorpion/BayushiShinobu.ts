import { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { Players, CardTypes, Durations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class BayushiShinobu extends DrawCard {
    static id = 'bayushi-shinobu';

    public setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCharacterEntersPlay: (event: any, context: AbilityContext) => event.card === context.source
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        context.source.dishonor();
                    }
                }),
                duration: Durations.Persistent,
                multipleTrigger: true
            })
        });

        this.action({
            title: 'Take control of a character',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.isDishonored,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.takeControl(context.player),
                        duration: Durations.UntilEndOfPhase
                    })),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        target: context.player,
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onCardLeavesPlay: (event) => event.card === context.target
                            },
                            onlyRemoveOnSuccess: true,
                            gameAction: AbilityDsl.actions.loseHonor(({
                                amount: 2,
                                target: context.player
                            })),
                            message: '{0} loses 2 honor due to the delayed effect of {1}',
                            messageArgs: [context.player, context.source]
                        }),
                        duration: Durations.UntilEndOfPhase
                    }))
                ])
            },
            effect: 'take control of {0}'
        });
    }
}


