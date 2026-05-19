import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheWarrior extends DrawCard {
    static id = 'way-of-the-warrior';

    setupCardAbilities() {
        this.action({
            title: 'Let a bushi embrace the way of the warrior',

            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
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
                            }),
                            AbilityDsl.effects.cardCannot({
                                cannot: 'dishonor',
                                restricts: 'opponentsCardEffects',
                                applyingPlayer: context.player
                            })
                        ]
                    })),
                    AbilityDsl.actions.ready()
                ])
            },
            effect: 'ready and prevent opponent\'s card effects from bowing, sending home, or dishonoring {0}'
        });
    }
}


export default WayOfTheWarrior;
