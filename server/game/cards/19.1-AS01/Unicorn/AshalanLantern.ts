import { msg } from '../../../GameChat.js';
import { CardType, DeckType, Duration, PlayType, Blocker, RemainingCards, Players } from '../../../Constants.js';
import { PlayIntoLocation } from '../../../PlayCharacterAction.js';
import { asIfFromHandPlayActions } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import * as costs from '../../../costs/index.js';
import { reduceNextPlayedCardCost } from '../../../effects.js';
import { deckSearch, discardFromPlay, playCard, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AshalanLantern extends DrawCard {
    static id = 'ashalan-lantern';

    public override setupCardAbilities() {
        this.conflictAction('Play a character from your opponent\'s dynasty deck', { evenFromHome: true })
            .cost(costs.nameCard())
            .gameAction(sequential([
                playerLastingEffect((context) => ({
                    target: Players.Self,
                    duration: Duration.UntilPassPriority,
                    effect: reduceNextPlayedCardCost(
                        3,
                        (card) => card.name === context.costs.namedCard
                    )
                })),
                deckSearch((context) => ({
                    cardsToLookAt: 3,
                    deck: DeckType.Dynasty,
                    target: context.player.opponent,
                    player: Players.Self,
                    remainingCards: RemainingCards.Top,
                    cardCondition: (card) => card.type === CardType.Character && !card.isUnique(),
                    gameAction: playCard((deckSearchContext) => {
                        const target = deckSearchContext.deckSearchSelected[0];
                        return {
                            target,
                            source: this,
                            resetOnCancel: false,
                            playType: PlayType.PlayFromHand,
                            playAction: target ? asIfFromHandPlayActions(target, { into: PlayIntoLocation.Conflict }) : undefined,
                            ignoredBlockers: [Blocker.WrongPhase],
                            postHandler: () => discardFromPlay({ target: context.source }).resolve(context.player, context)
                        };
                    }),
                    remainingCardsHandler: (context, _event, cards) => {
                        context.game.addMessage(msg`${context.player} puts ${cards} on the top of ${context.player.opponent}'s dynasty deck`);
                    },
                    message: (context, selectedCards) => msg`${context.player}${selectedCards.length > 0 ? ' compels ' : ' takes nothing'}${selectedCards}${selectedCards.length > 0 ? ' into service' : ''}`
                }))
            ]))
            .chatText((context) => msg`look for a character on the top of ${context.player.opponent ?? ''}'s dynasty deck. They reveal ${context.player.opponent?.dynastyDeck.slice(0, 3) ?? []}`);
    }
}
