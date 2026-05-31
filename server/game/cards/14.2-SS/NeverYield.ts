import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Durations } from '../../Constants.js';

class NeverYield extends DrawCard {
    static id = 'never-yield';

    setupCardAbilities() {
        this.reaction({
            title: 'characters can\'t bow or be sent home',
            when: {
                onConflictDeclared: (event, context) => event.conflict.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.player.cardsInPlay.filter((card: any) => card.type === CardTypes.Character),
                effect: [
                    AbilityDsl.effects.cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    }),
                    AbilityDsl.effects.cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                ]
            })),
            effect: 'make it so {1}\'s card effects can\'t bow or send home {2}\'s characters currently in play until the end of the conflict.',
            effectArgs: context => [context.player.opponent as any, context.player]
        });
    }
}


export default NeverYield;
