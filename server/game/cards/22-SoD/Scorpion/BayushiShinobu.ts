import AbilityDsl from '../../../abilitydsl.js';
import { CardType, CharacterStatus, Duration, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiShinobu extends DrawCard {
    static id = 'bayushi-shinobu';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Dishonored)
        });

        // entersPlayWithStatus only covers playing it; put into play by an effect, it is dishonored afterwards
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCharacterEntersPlay: (event, context) => event.card === context.source && !context.source.isDishonored
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        context.source.dishonor();
                    }
                }),
                multipleTrigger: true
            })
        });

        this.action('Take control of a character')
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.isDishonored && !card.isUnique()
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.takeControl(context.player),
                    duration: Duration.UntilEndOfPhase
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    target: context.player,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onCardLeavesPlay: (event) => event.card === context.target
                        },
                        onlyRemoveOnSuccess: true,
                        gameAction: AbilityDsl.actions.loseHonor({
                            amount: 2,
                            target: context.player
                        }),
                        message: '{0} loses 2 honor due to the delayed effect of {1}',
                        messageArgs: [context.player, context.source]
                    }),
                    duration: Duration.UntilEndOfPhase
                }))
            ]))
            .effect('take control of {0}');
    }
}


