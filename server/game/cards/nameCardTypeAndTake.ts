import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Location, RemainingCards, TargetMode, type Trait } from '../Constants.js';
import type { Cost } from '../costs/Cost.js';
import type { DeckSearchProperties } from '../GameActions/DeckSearchAction.js';
import { moveCard } from '../GameActions/GameActions.js';
import { msg, type MessageArgs } from '../GameChat.js';

const CARD_TYPES = [CardType.Attachment, CardType.Character, CardType.Event];

/** Test of Skill and Work in Progress reveal 3 cards, or 4 if the player controls a character with the trait. */
export function revealCount(context: AbilityContext, trait: Trait): number {
    return context.player.cardsInPlay.some((card) => card.hasTrait(trait)) ? 4 : 3;
}

/** A cost that names a card type, recorded as `context.costs.namedCardType`. */
export function nameCardType(): Cost<{ namedCardType: CardType }> {
    return {
        getActionName: () => 'namedCardType',
        getCostMessage: (): MessageArgs => ['naming {0}', []],
        canPay: () => true,
        resolve(context) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                options: CARD_TYPES.map((type) => ({
                    text: type,
                    handler: () => {
                        context.costs.namedCardType = type;
                    }
                }))
            });
        },
        pay() {}
    };
}

/**
 * The player adds up to 2 of the revealed cards of the named type to their hand, and the rest are discarded.
 * Only the revealed cards still on top of the deck: a card played from the top of the deck was revealed but has left it.
 */
export function takeUpToTwoOfNamedType(context: AbilityContext & { costs: { namedCardType?: CardType; reveal?: BaseCard[] } }, trait: Trait): DeckSearchProperties {
    const revealed = context.costs.reveal;
    return {
        cardsToLookAt: revealed ? revealed.filter((card) => card.location === Location.ConflictDeck).length : revealCount(context, trait),
        mode: TargetMode.UpTo,
        numCards: 2,
        activePromptTitle: 'Select a card',
        doneButtonText: 'Done',
        hideIfNoLegalTargets: true,
        cardCondition: (card) => card.type === context.costs.namedCardType,
        gameAction: moveCard({ destination: Location.Hand }),
        remainingCards: RemainingCards.Discard,
        message: (context, cards) => msg`${context.player} adds ${cards} to their hand`,
        takesNothingMessage: () => undefined
    };
}
