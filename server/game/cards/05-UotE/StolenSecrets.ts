import DrawCard from '../../DrawCard.js';
import { Location, CardType, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class StolenSecrets extends DrawCard {
    static id = 'stolen-secrets';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Steal one of opponent\'s top 4 cards',
            condition: (context: AbilityContext<this>) => this.game.isDuringConflict('political') && !!context.player.opponent && context.player.opponent.conflictDeck.length > 0,
            cost: ability.costs.removeFate({
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isParticipating()
            }),
            effect: 'look at the top 4 cards of {1}\'s conflict deck and remove one from the game',
            effectArgs: (context: AbilityContext<this>) => context.player.opponent as Player,
            handler: (context: AbilityContext<this>) => {
                const opponent = context.player.opponent as Player;
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to remove from the game',
                    context: context,
                    cards: opponent.conflictDeck.slice(0, 4),
                    cardHandler: (card: any) => this.stealCard(card, opponent.conflictDeck.slice(0, 4).filter((c: DrawCard) => c !== card), context)
                });
            }
        });
    }

    stealCard(card: DrawCard, remainingCards: DrawCard[], context: AbilityContext<this>) {
        card.owner.removeCardFromPile(card);
        card.controller = context.player;
        card.moveTo(Location.RemovedFromGame);
        context.player.removedFromGame.unshift(card);
        context.source.lastingEffect((ability: typeof AbilityDsl) => ({
            until: {
                onCardMoved: (event: EventPayload<EventName.OnCardMoved>) => event.card === card && event.originalLocation === Location.RemovedFromGame
            },
            match: card,
            effect: [
                ability.effects.hideWhenFaceUp(),
                ability.effects.canPlayFromOwn(Location.RemovedFromGame, [card], this)
            ]
        }));
        this.game.checkGameState();
        if(remainingCards.length > 1) {
            this.rearrangePrompt(context, remainingCards, [], 'Which card do you want to be on top?');
        }
    }

    rearrangePrompt(context: AbilityContext<this>, promptCards: DrawCard[], orderedCards: DrawCard[], promptTitle: string) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: DrawCard) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c: DrawCard) => c !== card);
                if(promptCards.length > 1) {
                    this.rearrangePrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                }
                orderedCards.push(promptCards[0]);
                (context.player.opponent as Player).conflictDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}


export default StolenSecrets;
