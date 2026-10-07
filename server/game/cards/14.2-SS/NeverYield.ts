import DrawCard from '../../DrawCard.js';
import { cardCannot } from '../../effects.js';
import { CardType } from '../../Constants.js';

class NeverYield extends DrawCard {
    static id = 'never-yield';

    setupCardAbilities() {
        this.reaction('characters can\'t bow or be sent home')
            .when({
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter((card) => card.type === CardType.Character),
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
                    })
                ]
            }))
            .effect('make it so {1}\'s card effects can\'t bow or send home {2}\'s characters currently in play until the end of the conflict', context => [context.player.opponent, context.player]);
    }
}


export default NeverYield;
