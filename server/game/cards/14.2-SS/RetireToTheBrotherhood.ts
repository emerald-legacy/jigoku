import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';
import { Location, CardType, EventName } from '../../Constants.js';
import type Player from '../../Player.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import {
    discardFromPlay,
    handler,
    lookAt,
    multiple,
    opponentPutIntoPlay,
    putIntoPlay,
    sequential,
    shuffleDeck
} from '../../GameActions/GameActions.js';

export default class RetireToTheBrotherhood extends ProvinceCard {
    static id = 'retire-to-the-brotherhood';

    setupCardAbilities() {
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
                handler({
                    //just for the display message
                    handler: (context) => {
                        //Identify who actually entered play
                        const enteredPlay = context.events
                            .filter((a) => a.is(EventName.OnCharacterEntersPlay) && !a.cancelled)
                            .map((a) => a.card)
                            .filter((a) => !!a);
                        const myEnter = enteredPlay.filter((a) => a.controller === context.player);
                        const oppEnter = enteredPlay.filter((a) => a.controller === context.player.opponent);
                        if(myEnter.length > 0) {
                            this.game.addMessage(msg`${context.player} puts ${myEnter} into play`);
                        }
                        if(oppEnter.length > 0) {
                            this.game.addMessage(msg`${context.player.opponent} puts ${oppEnter} into play`);
                        }
                    }
                }),
                multiple([
                    shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: context.player
                    })),
                    shuffleDeck((context) => ({
                        deck: Location.DynastyDeck,
                        target: context.player.opponent ? context.player.opponent : []
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
        const discarded = context.events.filter((event) =>
            event.is(EventName.OnCardLeavesPlay) && !event.cancelled && event.cardStateWhenLeftPlay?.controller === player).length;

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
}
