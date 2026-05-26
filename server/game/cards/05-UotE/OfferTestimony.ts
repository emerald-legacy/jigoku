import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes, EventNames } from '../../Constants.js';

class OfferTestimony extends DrawCard {
    static id = 'offer-testimony';

    setupCardAbilities() {
        this.action({
            title: 'Both players reveal a card',
            condition: context => context.player.opponent && context.game.isDuringConflict('political'),
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                }
            },
            effect: 'make each player choose a ready participating character they control: {1}',
            effectArgs: context => [Object.values(context.targets)],
            gameAction: [
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    location: Locations.Hand,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.reveal({ chatMessage: true })
                }),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a card to reveal',
                    player: Players.Opponent,
                    location: Locations.Hand,
                    controller: Players.Opponent,
                    gameAction: AbilityDsl.actions.reveal(context => ({ chatMessage: true, player: context.player.opponent }))
                }),
                // @ts-expect-error context.targets values are dynamically typed, filter returns unknown[] but game engine handles it
                AbilityDsl.actions.bow(context => {
                    let events = context.events.filter((event: any) => event.name === EventNames.OnCardRevealed);
                    let revealedCards = events.map((event: any) => event.card);
                    let lowestCost = Math.min(...revealedCards.map((card: any) => card.getCost()).filter((number: any) => Number.isInteger(number)));
                    let lowestCostPlayers = revealedCards.filter((card: any) => card.getCost() === lowestCost).map((card: any) => card.controller);
                    return { target: Object.values(context.targets).filter((card: any) => lowestCostPlayers.includes(card.controller)) };
                })
            ]
        });
    }
}


export default OfferTestimony;
