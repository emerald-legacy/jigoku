import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { CardType, RestrictionType } from '../../Constants.js';

class NeverYield extends DrawCard {
    static id = 'never-yield';

    setupCardAbilities() {
        this.reaction('characters can\'t bow or be sent home')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.type === CardType.Character),
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
                    })
                ]
            }))
            .chatText((context) => msg`make it so ${context.player.opponent}'s card effects can't bow or send home ${context.player}'s characters currently in play until the end of the conflict`);
    }
}


export default NeverYield;
