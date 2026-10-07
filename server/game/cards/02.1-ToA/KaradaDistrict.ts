import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { attach, discardFromPlay, ifAble, selectCard } from '../../GameActions/GameActions.js';

class KaradaDistrict extends DrawCard {
    static id = 'karada-district';

    setupCardAbilities() {
        this.action('Take control of an attachment')
            .cost(costs.giveFateToOpponent(1))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => Boolean(card.parentCharacter && card.parentCharacter.controller === context.player.opponent)
            })
            .gameAction(ifAble((context) => ({
                ifAbleAction: selectCard({
                    target: context.target,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    gameAction: attach({
                        attachment: context.target,
                        takeControl: true
                    }),
                    message: '{0} chooses to attach {1} to {2}',
                    messageArgs: (cards, player) => [player, context.target, cards]
                }),
                otherwiseAction: discardFromPlay({ target: context.target })
            })));
    }
}


export default KaradaDistrict;
