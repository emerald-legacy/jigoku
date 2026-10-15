import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardMatching, lookAt, multiple } from '../../GameActions/GameActions.js';
import { randomHandCards } from '../randomHandCards.js';

class KitsukiChiari extends DrawCard {
    static id = 'kitsuki-chiari';

    override setupCardAbilities() {
        this.reaction('Name a card')
            .when({
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player &&
                    context.player.opponent && context.player.opponent.hand.length > 0
            })
            .cost(costs.nameCard())
            .gameAction(multiple((context) => {
                const cards = randomHandCards(context.player.opponent, 4);
                return [
                    lookAt(() => ({
                        target: cards
                    })),
                    discardMatching((context) => ({
                        target: context.player.opponent,
                        cards: cards,
                        amount: -1, //all
                        reveal: false,
                        match: (context, card) => card.name === context.costs.namedCard
                    }))
                ];
            }))
            .chatText((context) => msg`look at 4 random cards in ${context.player.opponent}'s hand and discard all cards named ${context.costs.namedCard}`);
    }


    override allowAttachment(attachment: DrawCard) {
        if(attachment.hasTrait(Trait.Poison) && !this.isBlank()) {
            return false;
        }

        return super.allowAttachment(attachment);
    }
}

export default KitsukiChiari;
