import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import { arrangeTopOfDeck } from '../arrangeTopOfDeck.js';

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
                [this.getChoiceName('OppDynasty')]: () => !!this.owner.opponent && this.owner.opponent.dynastyDeck.length > 0,
                [this.getChoiceName('OppConflict')]: () => !!this.owner.opponent && this.owner.opponent.conflictDeck.length > 0,
                [this.getChoiceName('MyDynasty')]: () => this.owner.dynastyDeck.length > 0,
                [this.getChoiceName('MyConflict')]: () => this.owner.conflictDeck.length > 0
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

    private getChoiceName(key: string) {
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

    private mapChoiceToEffectArgs(context: AbilityContext): (string | Player)[] {
        const opponent = this.owner.opponent;
        switch(context.select) {
            case this.getChoiceName('OppDynasty'):
                return opponent ? [opponent, 'dynasty deck'] : [];
            case this.getChoiceName('OppConflict'):
                return opponent ? [opponent, 'conflict deck'] : [];
            case this.getChoiceName('MyDynasty'):
                return [this.owner, 'dynasty deck'];
            case this.getChoiceName('MyConflict'):
                return [this.owner, 'conflict deck'];
            default:
                return [];
        }
    }

    private mapChoiceToDeck(context: AbilityContext): DrawCard[] {
        const opponent = this.owner.opponent;
        switch(context.select) {
            case this.getChoiceName('OppDynasty'):
                return opponent?.dynastyDeck ?? [];
            case this.getChoiceName('OppConflict'):
                return opponent?.conflictDeck ?? [];
            case this.getChoiceName('MyDynasty'):
                return this.owner.dynastyDeck;
            case this.getChoiceName('MyConflict'):
                return this.owner.conflictDeck;
            default:
                return [];
        }
    }
}


export default Truthseeker;
