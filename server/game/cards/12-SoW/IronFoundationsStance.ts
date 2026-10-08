import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect, conditional, draw, multiple } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class IronFoundationsStance extends DrawCard {
    static id = 'iron-foundations-stance';

    setupCardAbilities() {
        this.action('Prevent opponent\'s bow and send home effects')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                })),
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                })),
                conditional({
                    condition: (context) => context.player.isKihoPlayedThisConflict(context, this),
                    trueGameAction: draw((context) => ({ target: context.player }))
                })
            ]))
            .chatText('prevent opponents\' actions from bowing or moving home {0}{1}', (context) => (context.player.isKihoPlayedThisConflict(context, this) ? ' and draw 1 card' : ''));
    }
}


export default IronFoundationsStance;
