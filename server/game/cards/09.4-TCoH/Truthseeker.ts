import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import { DeckType } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';
import { deckChoiceName } from '../deckChoiceName.js';

class Truthseeker extends DrawCard {
    static id = 'truthseeker';

    setupCardAbilities() {
        this.reaction('Look at top 3 cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .select({
                targets: true,
                activePromptTitle: 'Choose which deck to look at:'
            }, {
                [deckChoiceName(this.owner, 'OppDynasty')]: this.rearrange(() => this.owner.opponent, DeckType.Dynasty),
                [deckChoiceName(this.owner, 'OppConflict')]: this.rearrange(() => this.owner.opponent, DeckType.Conflict),
                [deckChoiceName(this.owner, 'MyDynasty')]: this.rearrange(() => this.owner, DeckType.Dynasty),
                [deckChoiceName(this.owner, 'MyConflict')]: this.rearrange(() => this.owner, DeckType.Conflict)
            })
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

    private rearrange(player: () => Player | undefined, deck: DeckType) {
        return rearrangeDeck(() => ({
            target: player() ?? [],
            deck,
            amount: 3,
            activePromptTitle: 'Select the card you would like to place on top of the deck'
        }));
    }
}


export default Truthseeker;
