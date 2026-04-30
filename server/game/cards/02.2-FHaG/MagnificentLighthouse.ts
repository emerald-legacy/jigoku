import DrawCard from '../../drawcard';
import { Locations, TargetModes } from '../../Constants';

class MagnificentLighthouse extends DrawCard {
    static id = 'magnificent-lighthouse';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 3 cards',
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    'Dynasty Deck': context => context.player.opponent && context.player.opponent.dynastyDeck.length > 0,
                    'Conflict Deck': context => context.player.opponent && context.player.opponent.conflictDeck.length > 0
                }
            },
            effect: 'look at the top 3 cards of {1}\'s {2}',
            effectArgs: context => [context.player.opponent, context.select.toLowerCase()],
            handler: context => {
                let topThree = [];
                if(context.select === 'Dynasty Deck') {
                    topThree = context.player.opponent.dynastyDeck.slice(0, 3);
                } else {
                    topThree = context.player.opponent.conflictDeck.slice(0, 3);
                }
                let messages = ['{0} places a card on the bottom of the deck', '{0} chooses to discard {1}'];
                let destinations = [topThree[0].isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom', topThree[0].isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile];
                let choices = [];
                let handlers = [];
                let cardHandler = card => {
                    this.game.addMessage(messages.pop(), context.player, card);
                    context.player.opponent.moveCard(card, destinations.pop());
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
