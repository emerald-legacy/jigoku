import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType, EventName } from '../../Constants.js';

class OfferTestimony extends DrawCard {
    static id = 'offer-testimony';

    setupCardAbilities() {
        this.action('Both players reveal a card')
            .condition(context => !!(context.player.opponent && context.game.isDuringConflict('political')))
            .target('myCharacter', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
            })
            .target('oppCharacter', {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
            })
            .gameAction(AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a card to reveal',
                location: Location.Hand,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
            }), AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a card to reveal',
                player: Players.Opponent,
                location: Location.Hand,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
            }), AbilityDsl.actions.bow(context => {
                const revealedCards = context.events.flatMap((event) =>
                    event.is(EventName.OnCardRevealed) && event.card.isDrawCard() ? [event.card] : []);
                const lowestCost = Math.min(...revealedCards.map((card: DrawCard) => card.getCost()).filter((number: number | null): number is number => Number.isInteger(number)));
                const lowestCostPlayers = revealedCards.filter((card: DrawCard) => card.getCost() === lowestCost).map((card: DrawCard) => card.controller);
                return { target: [context.targets.myCharacter, context.targets.oppCharacter].filter((card) => lowestCostPlayers.includes(card.controller)) };
            }))
            .effect('make each player choose a ready participating character they control: {1}', context => [Object.values(context.targets)]);
    }
}


export default OfferTestimony;
