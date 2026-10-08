import type { AbilityContext } from '../../../AbilityContext.js';
import { perRound } from '../../../AbilityLimit.js';
import { gainPlayAction } from '../../../effects.js';
import { cardLastingEffect, discardCard, playCard, selectCard, sequential } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import { msg } from '../../../GameChat.js';

export default class ToConnectThePeople extends DrawCard {
    static id = 'to-connect-the-people';

    public setupCardAbilities() {
        this.action('Play a character from your opponent\'s discard pile')
            .condition((context) =>
                !context.game.isDuringConflict() &&
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardType.Character && card.hasTrait('merchant')
                ))
            .gameAction(sequential([
                discardCard((context) => ({
                    target: this.topThreeCards(context)
                })),
                selectCard({
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                    targets: true,
                    cardCondition: (card, context) => !card.isUnique() && card.glory <= this.maxMerchantGlory(context),
                    mode: TargetMode.Single,
                    gameAction: sequential([
                        cardLastingEffect({
                            effect: [
                                gainPlayAction(PlayCharacterAsIfFromHand),
                                gainPlayAction(PlayDisguisedCharacterAsIfFromHand)
                            ]
                        }),
                        playCard({ ignoredRequirements: ['location'] })
                    ])
                })
            ]))
            .chatText((context) => msg`discard ${this.topThreeCards(context)} from the top of ${context.player.opponent}'s dynasty deck`)
            .max(perRound(1));
    }

    private topThreeCards(context: AbilityContext) {
        return context.player.opponent?.dynastyDeck.slice(0, 3) ?? [];
    }

    private maxMerchantGlory(context: AbilityContext) {
        return context.player.cardsInPlay.reduce(
            (maxGlory, card) =>
                card.getType() === CardType.Character && card.hasTrait('merchant') && card.glory > maxGlory
                    ? card.glory
                    : maxGlory,
            0
        );
    }
}
