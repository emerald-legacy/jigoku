import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class SpreadingTheDarkness extends DrawCard {
    static id = 'spreading-the-darkness';

    setupCardAbilities() {
        this.action({
            title: 'Give a character +4/+0',

            cost: AbilityDsl.costs.payHonor(2),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(4),
                        AbilityDsl.effects.cardCannot({
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
