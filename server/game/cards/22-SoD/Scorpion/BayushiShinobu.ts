import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { delayedEffect, entersPlayWithStatus, takeControl } from '../../../effects.js';
import {
    cardLastingEffect,
    handler,
    loseHonor,
    multiple,
    playerLastingEffect
} from '../../../GameActions/GameActions.js';
import { CardType, Duration, Location, Players, EntersPlayStatus } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiShinobu extends DrawCard {
    static id = 'bayushi-shinobu';

    public override setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetLocation: Location.Any,
            effect: entersPlayWithStatus(EntersPlayStatus.Dishonored)
        });

        // entersPlayWithStatus only covers playing it; put into play by an effect, it is dishonored afterwards
        this.persistentEffect({
            effect: delayedEffect({
                when: {
                    onCharacterEntersPlay: (event, context) => event.card === context.source && !context.source.isDishonored
                },
                gameAction: handler({
                    handler: (context) => {
                        context.source.dishonor();
                    }
                }),
                multipleTrigger: true
            })
        });

        this.action('Take control of a character')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.isDishonored && !card.isUnique()
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: takeControl(context.player),
                    duration: Duration.UntilEndOfPhase
                })),
                playerLastingEffect((context) => ({
                    target: Players.Self,
                    effect: delayedEffect({
                        when: {
                            onCardLeavesPlay: (event) => event.card === context.target
                        },
                        onlyRemoveOnSuccess: true,
                        gameAction: loseHonor({
                            amount: 2,
                            target: context.player
                        }),
                        message: () => msg`${context.player} loses 2 honor due to the delayed effect of ${context.source}`
                    }),
                    duration: Duration.UntilEndOfPhase
                }))
            ]))
            .chatText('take control of {0}');
    }
}


