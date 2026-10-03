import type { AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { Location, CardType, EventName } from '../../Constants.js';
import type Player from '../../Player.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class RetireToTheBrotherhood extends ProvinceCard {
    static id = 'retire-to-the-brotherhood';

    setupCardAbilities() {
        this.reaction('Retire characters with no fate')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardFromPlay((context) => ({
                    target: context.player.cardsInPlay
                        .filter((a: DrawCard) => a.getFate() === 0)
                        .concat(
                            context.player.opponent
                                ? context.player.opponent.cardsInPlay.filter((a: DrawCard) => a.getFate() === 0)
                                : []
                        )
                })),
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.lookAt((context) => ({
                        target: this.getRevealedCards(context, context.player),
                        message: '{0} reveals {1}',
                        messageArgs: (cards) => [context.player, cards]
                    })),
                    AbilityDsl.actions.lookAt((context) => ({
                        target: this.getRevealedCards(context, context.player.opponent),
                        message: '{0} reveals {1}',
                        messageArgs: (cards) => [context.player.opponent, cards]
                    }))
                ]),
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.putIntoPlay((context) => ({
                        target: this.getCharacters(context, context.player)
                    })),
                    AbilityDsl.actions.opponentPutIntoPlay((context) => ({
                        target: this.getCharacters(context, context.player.opponent)
                    }))
                ]),
                AbilityDsl.actions.handler({
                    //just for the display message
                    handler: (context) => {
                        //Identify who actually entered play
                        const enteredPlay = context.events
                            .filter((a) => a.name === 'onCharacterEntersPlay' && !a.cancelled)
                            .map((a) => a.card)
                            .filter((a): a is DrawCard => !!a);
                        const myEnter = enteredPlay.filter((a) => a.controller === context.player);
                        const oppEnter = enteredPlay.filter((a) => a.controller === context.player.opponent);
                        if(myEnter.length > 0) {
                            this.game.addMessage('{0} puts {1} into play', context.player, myEnter);
                        }
                        if(oppEnter.length > 0) {
                            this.game.addMessage('{0} puts {1} into play', context.player.opponent, oppEnter);
                        }
                    }
                }),
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: context.player
                    })),
                    AbilityDsl.actions.shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: context.player.opponent ? context.player.opponent : []
                    }))
                ])
            ]));
    }

    getBrotherhoodCards(context: AbilityContext, player: Player | undefined) {
        if(!player) {
            const def = [];
            def.push([]);
            def.push([]);
            return def;
        }
        const allCards = context.events.flatMap((event) =>
            event.is(EventName.OnCardLeavesPlay) && !event.cancelled && event.cardStateWhenLeftPlay ? [event.cardStateWhenLeftPlay] : []);
        const cards = allCards.filter((a: BaseCard) => a.controller === player);

        //Figure out how many cards to reveal and which characters to put into play
        const deck = player.dynastyDeck.slice();
        const revealedCards = [];
        const characters = [];
        for(let i = 0; i < deck.length && characters.length < cards.length; i++) {
            revealedCards.push(deck[i]);
            if(deck[i].type === CardType.Character) {
                characters.push(deck[i]);
            }
        }

        const results = [];
        results.push(revealedCards);
        results.push(characters);
        return results;
    }

    getRevealedCards(context: AbilityContext, player: Player | undefined) {
        return this.getBrotherhoodCards(context, player)[0];
    }

    getCharacters(context: AbilityContext, player: Player | undefined) {
        return this.getBrotherhoodCards(context, player)[1];
    }
}
