import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { handler } from '../../GameActions/GameActions.js';
import { AbilityType, Location } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ShojusDiviner extends DrawCard {
    static id = 'shoju-s-diviner';

    setupCardAbilities() {
        this.dire({
            effect: gainAbility(AbilityType.Action, {
                title: 'Divine your conflict deck',
                printedAbility: false,
                condition: (context) => context.player.conflictDeck.length > 0,
                chatText: 'look at the top 8 cards of their conflict deck',
                gameAction: handler({
                    handler: (context) => this.chooseCardsToKeep(context, context.player.conflictDeck.slice(0, 8))
                })
            })
        });
    }

    private chooseCardsToKeep(context: AbilityContext, cards: DrawCard[]) {
        let remaining = cards;
        const chosen: DrawCard[] = [];

        const finish = () => {
            if(remaining.length > 0) {
                this.game.addMessage('{0} discards {1}', context.player, remaining);
                remaining.forEach((card) => context.player.moveCard(card, Location.ConflictDiscardPile));
            }
            if(chosen.length > 0) {
                this.game.addMessage('{0} places {1} card{2} on top of their deck', context.player, chosen.length, chosen.length > 1 ? 's' : '');
                context.player.conflictDeck.splice(0, chosen.length, ...chosen);
            }
        };

        const chooseNext = () => {
            if(remaining.length === 0) {
                finish();
                return;
            }
            const position = chosen.length > 0 ? `under ${chosen[chosen.length - 1].name}` : 'on top of your deck';
            this.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: `Select the card to put ${position}`,
                context: context,
                cards: remaining,
                cardHandler: (card) => {
                    remaining = remaining.filter((a) => a !== card);
                    chosen.push(card);
                    chooseNext();
                },
                options: [{ text: 'Discard the rest', handler: finish }]
            });
        };

        chooseNext();
    }
}


export default ShojusDiviner;
