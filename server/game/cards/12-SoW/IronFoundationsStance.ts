import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, Players } from '../../Constants';

class IronFoundationsStance extends DrawCard {
    static id = 'iron-foundations-stance';

    setupCardAbilities() {
        this.action({
            title: 'Prevent opponent\'s bow and send home effects',

            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.conditional({
                        condition: (context) => context.player.isKihoPlayedThisConflict(context, this),
                        trueGameAction: AbilityDsl.actions.draw((context) => ({ target: context.player })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ])
            },
            effect: 'prevent opponents\' actions from bowing or moving home {0}{1}',
            effectArgs: (context) => (context.player.isKihoPlayedThisConflict(context, this) ? ' and draw 1 card' : '')
        });
    }
}


export default IronFoundationsStance;
