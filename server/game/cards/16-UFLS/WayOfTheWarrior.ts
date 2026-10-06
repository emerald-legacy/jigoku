import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect, ready, sequential } from '../../GameActions/GameActions.js';

class WayOfTheWarrior extends DrawCard {
    static id = 'way-of-the-warrior';

    setupCardAbilities() {
        this.action('Let a bushi embrace the way of the warrior')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi')
            }, sequential([
                cardLastingEffect(context => ({
                    effect: [
                        cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        }),
                        cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        }),
                        cardCannot({
                            cannot: 'dishonor',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    ]
                })),
                ready()
            ]))
            .effect('ready and prevent opponent\'s card effects from bowing, sending home, or dishonoring {0}');
    }
}


export default WayOfTheWarrior;
