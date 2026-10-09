import { msg } from '../../../GameChat.js';
import { CardType, DeckType, Duration, Location, PlayType, Blocker } from '../../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHandIntoConflict } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import * as costs from '../../../costs/index.js';
import { reduceNextPlayedCardCost } from '../../../effects.js';
import { deckSearch, playCard, playerLastingEffect, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AshalanLantern extends DrawCard {
    static id = 'ashalan-lantern';

    public setupCardAbilities() {
        this.conflictAction('Play a character from your opponent\'s dynasty deck', { evenFromHome: true })
            .cost(costs.nameCard())
            .gameAction(sequential([
                playerLastingEffect((context) => ({
                    duration: Duration.UntilPassPriority,
                    targetController: context.player,
                    effect: reduceNextPlayedCardCost(
                        3,
                        (card) => card.name === context.costs.namedCard
                    )
                })),
                deckSearch((context) => ({
                    cardsToLookAt: 3,
                    deck: DeckType.Dynasty,
                    player: context.player.opponent,
                    choosingPlayer: context.player,
                    shuffle: false,
                    cardCondition: (card) => card.type === CardType.Character && !card.isUnique(),
                    gameAction: playCard((deckSearchContext) => {
                        const target = deckSearchContext.deckSearchSelected[0];
                        return {
                            target,
                            source: this,
                            resetOnCancel: false,
                            playType: PlayType.PlayFromHand,
                            playAction: target
                                ? [
                                    new PlayCharacterAsIfFromHandIntoConflict(target),
                                    new PlayDisguisedCharacterAsIfFromHandIntoConflict(target)
                                ]
                                : undefined,
                            ignoredBlockers: [Blocker.WrongPhase],
                            postHandler: () => context.player.moveCard(context.source, Location.ConflictDiscardPile)
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
