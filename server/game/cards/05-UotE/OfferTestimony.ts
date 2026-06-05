import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType, EventName } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import type { Event } from '../../Events/Event.js';

class OfferTestimony extends DrawCard {
    static id = 'offer-testimony';

    setupCardAbilities() {
        this.action({
            title: 'Both players reveal a card',
            condition: context => !!(context.player.opponent && context.game.isDuringConflict('political')),
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                }
            },
            effect: 'make each player choose a ready participating character they control: {1}',
            effectArgs: context => [Object.values(context.targets)],
            gameAction: [
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    location: Location.Hand,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    player: Players.Opponent,
                    location: Location.Hand,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
                }),
                AbilityDsl.actions.bow(context => {
                    let events = context.events.filter((event: Event) => event.name === EventName.OnCardRevealed);
                    let revealedCards = events.map((event: Event) => (event as Event & { card: DrawCard }).card);
                    let lowestCost = Math.min(...revealedCards.map((card: DrawCard) => card.getCost()).filter((number: number | null) => Number.isInteger(number)));
                    let lowestCostPlayers = revealedCards.filter((card: DrawCard) => card.getCost() === lowestCost).map((card: DrawCard) => card.controller);
                    // @ts-expect-error context.targets values are dynamically typed (BaseCard | BaseCard[]); game engine handles the array case
                    return { target: Object.values(context.targets).filter((card: BaseCard) => lowestCostPlayers.includes(card.controller)) };
                })
            ]
        });
    }
}


export default OfferTestimony;
