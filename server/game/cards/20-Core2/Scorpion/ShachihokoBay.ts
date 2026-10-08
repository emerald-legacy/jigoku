import type { AbilityContext } from '../../../AbilityContext.js';
import { Location } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { canPlayFromOwn } from '../../../effects.js';
import type DrawCard from '../../../DrawCard.js';
import { handler, rearrangeDeck } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

class Process {
    private topCards: Set<DrawCard>;
    private cardsToSteal: Set<DrawCard> = new Set();

    public constructor(private context: AbilityContext) {
        this.topCards = new Set(context.player.opponent?.conflictDeck.slice(0, 6) ?? []);
    }

    public start() {
        if(this.topCards.size > 0) {
            this.stealPrompt();
        }
    }

    private get topCardsArray() {
        return Array.from(this.topCards);
    }

    private stealPrompt() {
        const x = this.cardsToSteal.size + 1;
        const y = Math.min(3, this.topCards.size);
        this.context.game.promptWithHandlerMenu(this.context.player, {
            activePromptTitle: `Select a card to take for you (${x} of ${y})`,
            context: this.context,
            cards: this.topCardsArray,
            cardHandler: (card) => this.stealChosen(card),
            options: [{ text: 'Done', handler: () => this.stealCardsAndContinue() }]
        });
    }

    private stealChosen(card: DrawCard): void {
        this.topCards.delete(card);
        this.cardsToSteal.add(card);
        if(this.cardsToSteal.size < 3) {
            this.stealPrompt();
        } else {
            this.stealCardsAndContinue();
        }
    }

    private stealCardsAndContinue() {
        if(this.cardsToSteal.size > 0) {
            this.context.game.addMessage(
                '{0} takes {1} from {2}\'s deck',
                this.context.player,
                Array.from(this.cardsToSteal),
                this.context.player.opponent
            );
            for(const card of this.cardsToSteal) {
                this.context.player.moveCard(card, Location.RemovedFromGame);
                card.controller = this.context.player;
                this.context.source.lastingEffect({
                    until: {
                        onCardMoved: (event) =>
                            event.card === card && event.originalLocation === Location.RemovedFromGame
                    },
                    match: card,
                    effect: [canPlayFromOwn(Location.RemovedFromGame, [card], this.context.source)]
                });
            }
        }

        const remaining = this.topCardsArray;
        if(remaining.length === 0) {
            return;
        }
        const opponent = this.context.player.opponent;
        if(!opponent) {
            return;
        }
        rearrangeDeck({
            amount: remaining.length,
            message: (ordered, context) => msg`${context.player} returns ${ordered.length} cards to the top of ${opponent}'s deck`
        }).resolve(opponent, this.context);
    }
}

export default class ShachihokoBay extends ProvinceCard {
    static id = 'shachihoko-bay';

    setupCardAbilities() {
        this.interrupt('Look at the top 6 cards of the attacker\'s deck and steal up to 3 of them')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.game.currentConflict && Boolean(context.player.opponent)
            })
            .gameAction(handler({
                handler: (context) => new Process(context).start()
            }));
    }
}
