import { TargetModes } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';

class Truthseeker extends DrawCard {
    static id = 'truthseeker';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 3 cards',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.Select,
                targets: true,
                activePromptTitle: 'Choose which deck to look at:',
                choices: {
                    [this.getChoiceName('OppDynasty')]: (context: AbilityContext) =>
                        !!context.player.opponent && context.player.opponent.dynastyDeck.length > 0,
                    [this.getChoiceName('OppConflict')]: (context: AbilityContext) =>
                        !!context.player.opponent && context.player.opponent.conflictDeck.length > 0,
                    [this.getChoiceName('MyDynasty')]: (context: AbilityContext) =>
                        !!context.player && context.player.dynastyDeck.length > 0,
                    [this.getChoiceName('MyConflict')]: (context: AbilityContext) =>
                        !!context.player && context.player.conflictDeck.length > 0
                }
            },
            effect: 'look at the top 3 cards of {1}\'s {2}',
            effectArgs: (context: AbilityContext) => this.mapChoiceToEffectArgs(context) as [Player, string],
            handler: (context: any) => {
                const cardsToSort = this.mapChoiceToCards(context);
                this.truthSeekerPrompt(
                    context,
                    cardsToSort,
                    [],
                    'Select the card you would like to place on top of the deck.'
                );
            }
        });
    }

    getChoiceName(key: string) {
        if(key === 'MyDynasty') {
            return `${this.owner.name}'s Dynasty`;
        }
        if(key === 'MyConflict') {
            return `${this.owner.name}'s Conflict`;
        }
        if(this.owner.opponent) {
            if(key === 'OppDynasty') {
                return `${this.owner.opponent.name}'s Dynasty`;
            }
            if(key === 'OppConflict') {
                return `${this.owner.opponent.name}'s Conflict`;
            }
        }

        return 'N/A';
    }

    mapChoiceToEffectArgs(context: AbilityContext): (string | Player)[] {
        const opponent = this.owner.opponent as Player;
        switch(context.select) {
            case this.getChoiceName('OppDynasty'):
                return [opponent, 'dynasty deck'];
            case this.getChoiceName('OppConflict'):
                return [opponent, 'conflict deck'];
            case this.getChoiceName('MyDynasty'):
                return [this.owner, 'dynasty deck'];
            case this.getChoiceName('MyConflict'):
                return [this.owner, 'conflict deck'];
            default:
                return [];
        }
    }

    mapChoiceToCards(context: AbilityContext): DrawCard[] {
        const opponent = this.owner.opponent as Player;
        switch(context.select) {
            case this.getChoiceName('OppDynasty'):
                return opponent.dynastyDeck.slice(0, 3);
            case this.getChoiceName('OppConflict'):
                return opponent.conflictDeck.slice(0, 3);
            case this.getChoiceName('MyDynasty'):
                return this.owner.dynastyDeck.slice(0, 3);
            case this.getChoiceName('MyConflict'):
                return this.owner.conflictDeck.slice(0, 3);
            default:
                return [];
        }
    }

    mapChoiceToDeck(context: AbilityContext): DrawCard[] {
        const opponent = this.owner.opponent as Player;
        switch(context.select) {
            case this.getChoiceName('OppDynasty'):
                return opponent.dynastyDeck;
            case this.getChoiceName('OppConflict'):
                return opponent.conflictDeck;
            case this.getChoiceName('MyDynasty'):
                return this.owner.dynastyDeck;
            case this.getChoiceName('MyConflict'):
                return this.owner.conflictDeck;
            default:
                return [];
        }
    }

    truthSeekerPrompt(context: AbilityContext, promptCards: DrawCard[], orderedCards: DrawCard[], promptTitle: string) {
        const orderPrompt = ['first', 'second'];
        const deckToReorder = this.mapChoiceToDeck(context);
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: DrawCard) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c: DrawCard) => c !== card);
                if(promptCards.length > 1) {
                    this.truthSeekerPrompt(
                        context,
                        promptCards,
                        orderedCards,
                        'Which card do you want to be the ' + orderPrompt[orderedCards.length] + ' card?'
                    );
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.push(promptCards[0]);
                }
                deckToReorder.splice(0, 3, ...orderedCards);
            }
        });
    }
}


export default Truthseeker;
