import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import { arrangeTopOfDeck } from '../arrangeTopOfDeck.js';
import { deckChoiceName } from '../deckChoiceName.js';

class Truthseeker extends DrawCard {
    static id = 'truthseeker';

    setupCardAbilities() {
        this.reaction('Look at top 3 cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .selectIf({
                targets: true,
                activePromptTitle: 'Choose which deck to look at:'
            }, {
                [deckChoiceName(this.owner, 'OppDynasty')]: () => !!this.owner.opponent && this.owner.opponent.dynastyDeck.length > 0,
                [deckChoiceName(this.owner, 'OppConflict')]: () => !!this.owner.opponent && this.owner.opponent.conflictDeck.length > 0,
                [deckChoiceName(this.owner, 'MyDynasty')]: () => this.owner.dynastyDeck.length > 0,
                [deckChoiceName(this.owner, 'MyConflict')]: () => this.owner.conflictDeck.length > 0
            })
            .handler((context) => arrangeTopOfDeck(
                context,
                this.mapChoiceToDeck(context).slice(0, 3),
                'Select the card you would like to place on top of the deck',
                (ordered) => {
                    this.mapChoiceToDeck(context).splice(0, 3, ...ordered);
                }
            ))
            .effect('look at the top 3 cards of {1}\'s {2}', (context) => this.mapChoiceToEffectArgs(context));
    }

    private mapChoiceToEffectArgs(context: AbilityContext): (string | Player)[] {
        const opponent = this.owner.opponent;
        switch(context.select) {
            case deckChoiceName(this.owner, 'OppDynasty'):
                return opponent ? [opponent, 'dynasty deck'] : [];
            case deckChoiceName(this.owner, 'OppConflict'):
                return opponent ? [opponent, 'conflict deck'] : [];
            case deckChoiceName(this.owner, 'MyDynasty'):
                return [this.owner, 'dynasty deck'];
            case deckChoiceName(this.owner, 'MyConflict'):
                return [this.owner, 'conflict deck'];
            default:
                return [];
        }
    }

    private mapChoiceToDeck(context: AbilityContext): DrawCard[] {
        const opponent = this.owner.opponent;
        switch(context.select) {
            case deckChoiceName(this.owner, 'OppDynasty'):
                return opponent?.dynastyDeck ?? [];
            case deckChoiceName(this.owner, 'OppConflict'):
                return opponent?.conflictDeck ?? [];
            case deckChoiceName(this.owner, 'MyDynasty'):
                return this.owner.dynastyDeck;
            case deckChoiceName(this.owner, 'MyConflict'):
                return this.owner.conflictDeck;
            default:
                return [];
        }
    }
}


export default Truthseeker;
