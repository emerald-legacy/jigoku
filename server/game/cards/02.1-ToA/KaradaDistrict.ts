import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaradaDistrict extends DrawCard {
    static id = 'karada-district';

    setupCardAbilities() {
        this.action({
            title: 'Take control of an attachment',
            cost: AbilityDsl.costs.giveFateToOpponent(1),
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card, context) => Boolean(card.parent && card.parent.controller === context.player.opponent)
            },
            gameAction: AbilityDsl.actions.ifAble(context => ({
                ifAbleAction: AbilityDsl.actions.selectCard({
                    target: context.target,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.attach({
                        attachment: context.target,
                        takeControl: true
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (cards, player) => [player, context.target, cards]
                }),
                otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
            }))
        });
    }
}


export default KaradaDistrict;
