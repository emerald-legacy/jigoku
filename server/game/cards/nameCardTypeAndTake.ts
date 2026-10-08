import type { AbilityContext } from '../AbilityContext.js';
import { CardType, Location } from '../Constants.js';
import type { Cost } from '../costs/Cost.js';
import type DrawCard from '../DrawCard.js';
import { msg, type MessageArgs } from '../GameChat.js';

const CARD_TYPES = [CardType.Attachment, CardType.Character, CardType.Event];

/** Test of Skill and Work in Progress reveal 3 cards, or 4 if the player controls a character with the trait. */
export function revealCount(context: AbilityContext, trait: string): number {
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

/** The player adds up to 2 of the revealed cards of the named type to their hand, and the rest are discarded. */
export function takeUpToTwoOfNamedType(context: AbilityContext, revealed: readonly DrawCard[], namedType: CardType | undefined): void {
    const isMatching = (card: DrawCard) => card.type === namedType && card.location === Location.ConflictDeck;
    const others = revealed.filter((card) => !isMatching(card));
    let matching = revealed.filter((card) => isMatching(card) && card.uuid !== context.source.uuid);

    const discardRest = () => {
        const cards = others.concat(matching);
        context.game.addMessage(msg`${context.player} discards ${cards}`);
        for(const card of cards) {
            context.player.moveCard(card, Location.ConflictDiscardPile);
        }
    };
    const chooseCard = (picksLeft: number) => {
        if(picksLeft === 0 || matching.length === 0) {
            discardRest();
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card',
            context: context,
            cards: matching,
            cardHandler: (card) => {
                context.game.addMessage(msg`${context.player} adds ${card} to their hand`);
                context.player.moveCard(card, Location.Hand);
                matching = matching.filter((c) => c !== card);
                chooseCard(picksLeft - 1);
            },
            options: [{ text: 'Done', handler: discardRest }]
        });
    };

    chooseCard(2);
}
