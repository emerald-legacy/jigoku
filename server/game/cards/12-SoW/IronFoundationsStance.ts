import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Players } from '../../Constants.js';

class IronFoundationsStance extends DrawCard {
    static id = 'iron-foundations-stance';

    setupCardAbilities() {
        this.action('Prevent opponent\'s bow and send home effects')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            }, cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: 'sendHome',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })), cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .if((context) => context.player.isKihoPlayedThisConflict(context, this))
            .draw((context) => ({ target: context.player }))
            .chatText((context) => msg`prevent opponents' actions from bowing or moving home ${context.chatTarget()}${(context.player.isKihoPlayedThisConflict(context, this) ? ' and draw 1 card' : '')}`);
    }
}


export default IronFoundationsStance;
