import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { discardMatching, multiple, reveal } from '../../../GameActions/GameActions.js';
import { Location, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { randomHandCards } from '../../randomHandCards.js';

export default class HonestAssessment extends DrawCard {
    static id = 'honest-assessment';

    override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Courtier });

        this.reaction('Name a card')
            .when({
                onCardAttached: (event, context) =>
                    event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .cost(costs.nameCard())
            .gameAction(multiple((context) => {
                const cards = randomHandCards(context.player.opponent, 4);
                return [
                    reveal({ target: cards, chatMessage: true, player: context.player.opponent }),
                    discardMatching({
                        target: context.player.opponent,
                        cards,
                        amount: -1, //all
                        reveal: false,
                        match: (context, card) => card.name === context.costs.namedCard
                    })
                ];
            }))
            .chatText((context) => msg`reveal 4 random cards from ${context.player.opponent}'s hand and discard all copies of ${context.costs.namedCard}`)
            .max(perRound(1));
    }
}
