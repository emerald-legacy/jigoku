import type { AbilityContext } from '../../../AbilityContext.js';
import { perRound } from '../../../AbilityLimit.js';
import { playCard } from '../../../GameActions/GameActions.js';
import { CardType, Location, Players, TargetMode, Blocker, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import { msg } from '../../../GameChat.js';

export default class ToConnectThePeople extends DrawCard {
    static id = 'to-connect-the-people';

    public override setupCardAbilities() {
        this.action('Play a character from your opponent\'s discard pile')
            .condition((context) => !context.game.isDuringConflict())
            .ifCondition((context) =>
                context.player.cardsInPlay.some(
                    (card) => card.type === CardType.Character && card.hasTrait(Trait.Merchant)
                ))
            .discardCard((context) => ({ target: this.topThreeCards(context) }))
            .chatText((context) => msg`discard ${this.topThreeCards(context)} from the top of ${context.player.opponent}'s dynasty deck`)
            .max(perRound(1))
            .then()
            .selectCard({
                cardType: CardType.Character,
                controller: Players.Opponent,
                location: [Location.ConflictDiscardPile, Location.DynastyDiscardPile],
                targets: true,
                cardCondition: (card, context) => !card.isUnique() && card.glory <= this.maxMerchantGlory(context),
                mode: TargetMode.Single,
                subActionProperties: (card) => ({
                    target: card,
                    playAction: [new PlayCharacterAsIfFromHand(card), new PlayDisguisedCharacterAsIfFromHand(card)]
                }),
                gameAction: playCard({ ignoredBlockers: [Blocker.WrongLocation] })
            });
    }

    private topThreeCards(context: AbilityContext) {
        return context.player.opponent?.dynastyDeck.slice(0, 3) ?? [];
    }

    private maxMerchantGlory(context: AbilityContext) {
        return context.player.cardsInPlay.reduce(
            (maxGlory, card) =>
                card.type === CardType.Character && card.hasTrait(Trait.Merchant) && card.glory > maxGlory
                    ? card.glory
                    : maxGlory,
            0
        );
    }
}
