import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { bow, reveal, selectCard } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, EventName, ConflictType } from '../../Constants.js';

class OfferTestimony extends DrawCard {
    static id = 'offer-testimony';

    setupCardAbilities() {
        this.action('Both players reveal a card')
            .condition((context) => !!(context.player.opponent && context.game.isDuringConflict(ConflictType.Political)))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
            })
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
            })
            .gameAction(selectCard({
                activePromptTitle: 'Choose a card to reveal',
                location: Location.Hand,
                controller: Players.Self,
                gameAction: reveal({ chatMessage: true })
            }), selectCard({
                activePromptTitle: 'Choose a card to reveal',
                player: Players.Opponent,
                location: Location.Hand,
                controller: Players.Opponent,
                gameAction: reveal((context) => ({ chatMessage: true, player: context.player.opponent }))
            }), bow((context) => {
                const revealedCards = context.events.flatMap((event) =>
                    event.is(EventName.OnCardRevealed) && event.card.isDrawCard() ? [event.card] : []);
                const lowestCost = Math.min(...revealedCards.map((card) => card.getCost()).filter((number: number | null): number is number => Number.isInteger(number)));
                const lowestCostPlayers = revealedCards.filter((card) => card.getCost() === lowestCost).map((card) => card.controller);
                return { target: [context.targets.myCharacter, context.targets.oppCharacter].filter((card) => lowestCostPlayers.includes(card.controller)) };
            }))
            .chatText((context) => msg`make each player choose a ready participating character they control: ${Object.values(context.targets)}`);
    }
}


export default OfferTestimony;
