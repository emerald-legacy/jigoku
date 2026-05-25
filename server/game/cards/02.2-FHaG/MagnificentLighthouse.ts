import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import type Player from '../../player.js';
import DrawCard from '../../drawcard.js';
import { Locations, TargetModes } from '../../Constants.js';

class MagnificentLighthouse extends DrawCard {
    static id = 'magnificent-lighthouse';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 3 cards',
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Dynasty Deck': (context: AbilityContext) => !!context.player.opponent && context.player.opponent.dynastyDeck.length > 0,
                    'Conflict Deck': (context: AbilityContext) => !!context.player.opponent && context.player.opponent.conflictDeck.length > 0
                }
            },
            effect: 'look at the top 3 cards of {1}\'s {2}',
            effectArgs: (context: AbilityContext) => [context.player.opponent as Player, (context.select ?? '').toLowerCase()],
            handler: (context?: AbilityContext) => {
                if(!context || !context.player.opponent) {
                    return;
                }
                const opponent = context.player.opponent;
                let topThree: BaseCard[] = [];
                if(context.select === 'Dynasty Deck') {
                    topThree = opponent.dynastyDeck.slice(0, 3);
                } else {
                    topThree = opponent.conflictDeck.slice(0, 3);
                }
                if(topThree.length === 0) {
                    return;
                }
                let messages = ['{0} places a card on the bottom of the deck', '{0} chooses to discard {1}'];
                let destinations: string[] = [
                    topThree[0].isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom',
                    topThree[0].isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile
                ];
                let choices: string[] = [];
                let handlers: (() => void)[] = [];
                let cardHandler = (card: BaseCard) => {
                    const msg = messages.pop();
                    const dest = destinations.pop();
                    if(msg && dest) {
                        this.game.addMessage(msg, context.player, card);
                        opponent.moveCard(card, dest as Locations);
                    }
                    if(messages.length > 0) {
                        let index = topThree.indexOf(card);
                        topThree.splice(index, 1);
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card to put on the bottom of the deck',
                            context: context,
                            cards: topThree,
                            cardHandler: cardHandler,
                            handlers: handlers,
                            choices: choices
                        });
                    }
                };
                if(topThree.length < 3) {
                    choices = ['None'];
                    handlers.push(() => {
                        if(topThree.length === 2) {
                            choices.pop();
                            handlers.pop();
                        }
                        messages.pop();
                        destinations.pop();
                        if(messages.length > 0) {
                            this.game.promptWithHandlerMenu(context.player, {
                                activePromptTitle: 'Select a card to put on the bottom of the deck',
                                context: context,
                                cards: topThree,
                                cardHandler: cardHandler,
                                choices: choices,
                                handlers: handlers
                            });
                        }
                    });
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card to discard',
                    context: context,
                    cards: topThree,
                    cardHandler: cardHandler,
                    handlers: handlers,
                    choices: choices
                });
            }
        });
    }
}


export default MagnificentLighthouse;
