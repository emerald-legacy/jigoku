import type { AbilityContext } from '../../AbilityContext.js';
import type DrawCard from '../../DrawCard.js';
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
                        .filter((a) => a.getFate() === 0)
                        .concat(
                            context.player.opponent
                                ? context.player.opponent.cardsInPlay.filter((a) => a.getFate() === 0)
                                : []
                        )
                })),
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.lookAt((context) => ({
                        target: this.getBrotherhoodCards(context, context.player).revealed,
                        message: '{0} reveals {1}',
                        messageArgs: (cards) => [context.player, cards]
                    })),
                    AbilityDsl.actions.lookAt((context) => ({
                        target: this.getBrotherhoodCards(context, context.player.opponent).revealed,
                        message: '{0} reveals {1}',
                        messageArgs: (cards) => [context.player.opponent, cards]
                    }))
                ]),
                AbilityDsl.actions.multiple([
                    AbilityDsl.actions.putIntoPlay((context) => ({
                        target: this.getBrotherhoodCards(context, context.player).characters
                    })),
                    AbilityDsl.actions.opponentPutIntoPlay((context) => ({
                        target: this.getBrotherhoodCards(context, context.player.opponent).characters
                    }))
                ]),
                AbilityDsl.actions.handler({
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
