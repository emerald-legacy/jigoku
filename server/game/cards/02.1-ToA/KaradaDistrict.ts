import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { attach, selectCard } from '../../GameActions/GameActions.js';

class KaradaDistrict extends DrawCard {
    static id = 'karada-district';

    override setupCardAbilities() {
        const takeControl = selectCard((context) => ({
            target: context.target,
            cardType: CardType.Character,
            controller: Players.Self,
            gameAction: attach({
                attachment: context.target?.isDrawCard() ? context.target : undefined,
                takeControl: true
            }),
            message: (context, cards, player) => msg`${player} chooses to attach ${context.target} to ${cards}`
        }));

        this.action('Take control of an attachment')
            .cost(costs.giveFateToOpponent(1))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => Boolean(card.parentCharacter && card.parentCharacter.controller === context.player.opponent)
            })
            .ifAble()
            .gameAction(takeControl)
            .otherwise()
            .discardFromPlay((context) => ({ target: context.target }))
            .chatText((context) => takeControl.hasLegalTarget(context)
                ? msg`take control of ${context.target}`
                : msg`discard ${context.target}`);
    }
}


export default KaradaDistrict;
