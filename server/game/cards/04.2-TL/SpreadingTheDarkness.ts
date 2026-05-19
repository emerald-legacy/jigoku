import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class SpreadingTheDarkness extends DrawCard {
    static id = 'spreading-the-darkness';

    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +4/+0',

            cost: ability.costs.payHonor(2),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: [
                        ability.effects.modifyMilitarySkill(4),
                        ability.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    ]
                }))
            },
            effect: 'give {0} +4{1} and prevent them from being targeted by opponent\'s abilities',
            effectArgs: () => 'military'
        });
    }
}


export default SpreadingTheDarkness;
