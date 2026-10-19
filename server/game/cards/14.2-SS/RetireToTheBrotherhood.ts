import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';
import { Location, CardType, EventName } from '../../Constants.js';
import type Player from '../../Player.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import {
    chatMessage,
    discardFromPlay,
    lookAt,
    multiple,
    opponentPutIntoPlay,
    putIntoPlay,
    sequential,
    shuffleDeck
} from '../../GameActions/GameActions.js';

export default class RetireToTheBrotherhood extends ProvinceCard {
    static id = 'retire-to-the-brotherhood';

    override setupCardAbilities() {
        this.reaction('Retire characters with no fate')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(sequential([
                discardFromPlay((context) => ({
                    target: context.player.cardsInPlay
                        .filter((a) => a.getFate() === 0)
                        .concat(
                            context.player.opponent
                                ? context.player.opponent.cardsInPlay.filter((a) => a.getFate() === 0)
                                : []
                        )
                })),
                multiple([
                    lookAt((context) => ({
                        target: this.getBrotherhoodCards(context, context.player).revealed,
                        message: (context, cards) => msg`${context.player} reveals ${cards}`
                    })),
                    lookAt((context) => ({
                        target: this.getBrotherhoodCards(context, context.player.opponent).revealed,
                        message: (context, cards) => msg`${context.player.opponent} reveals ${cards}`
                    }))
                ]),
                multiple([
                    putIntoPlay((context) => ({
                        target: this.getBrotherhoodCards(context, context.player).characters
                    })),
                    opponentPutIntoPlay((context) => ({
                        target: this.getBrotherhoodCards(context, context.player.opponent).characters
                    }))
                ]),
                chatMessage((context) => this.enteredPlayMessage(context, context.player)),
                chatMessage((context) => this.enteredPlayMessage(context, context.player.opponent)),
                // a player who discarded nothing revealed nothing, so their deck isn't shuffled (EmeraldDB ruling)
                multiple([
                    shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: this.getDiscardedCount(context, context.player) > 0 ? context.player : []
                    })),
                    shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: context.player.opponent && this.getDiscardedCount(context, context.player.opponent) > 0 ? context.player.opponent : []
                    }))
                ])
            ]));
    }

    private getBrotherhoodCards(context: AbilityContext, player: Player | undefined) {
        const revealed: DrawCard[] = [];
        const characters: DrawCard[] = [];
        if(!player) {
            return { revealed, characters };
        }
        const discarded = this.getDiscardedCount(context, player);

        //Reveal cards until as many characters as were discarded are found
        for(const card of player.dynastyDeck) {
            if(characters.length >= discarded) {
                break;
            }
            revealed.push(card);
            if(card.type === CardType.Character) {
                characters.push(card);
            }
        }
        return { revealed, characters };
    }

    private getDiscardedCount(context: AbilityContext, player: Player) {
        return context.events.filter((event) =>
            event.is(EventName.OnCardLeavesPlay) && !event.cancelled && event.cardStateWhenLeftPlay?.controller === player).length;
    }

    private enteredPlayMessage(context: AbilityContext, player: Player | undefined) {
        const entered = context.events
            .filter((event) => event.is(EventName.OnCharacterEntersPlay) && !event.cancelled)
            .map((event) => event.card)
            .filter((card) => !!card && card.controller === player);
        return player && entered.length > 0 ? msg`${player} puts ${entered} into play` : undefined;
    }
}
