import DrawCard from '../../DrawCard.js';
import { CardType, Players, RestrictionType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect, ready, sequential } from '../../GameActions/GameActions.js';

class WayOfTheWarrior extends DrawCard {
    static id = 'way-of-the-warrior';

    setupCardAbilities() {
        this.action('Let a bushi embrace the way of the warrior')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('bushi')
            }, sequential([
                cardLastingEffect((context) => ({
                    effect: [
                        cardCannot({
                            cannot: RestrictionType.SendHome,
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        }),
                        cardCannot({
                            cannot: RestrictionType.Bow,
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        }),
                        cardCannot({
                            cannot: RestrictionType.Dishonor,
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    ]
                })),
                ready()
            ]))
            .chatText('ready and prevent opponent\'s card effects from bowing, sending home, or dishonoring {0}');
    }
}


export default WayOfTheWarrior;
