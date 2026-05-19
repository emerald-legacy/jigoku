import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Decks} from '../../Constants.js';

class DaughterOfWar extends DrawCard {
    static id = 'daughter-of-war';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });
        this.interrupt({
            title: 'Put a character into play ',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.deckSearch(context => ({
                activePromptTitle: 'Choose a character to put into play ',
                deck: Decks.DynastyDeck,
                cardCondition: card => card.type === CardTypes.Character && card.costLessThan(context.source.parent.getCost()),
                gameAction: AbilityDsl.actions.putIntoPlay()
            })),
            effect: 'search their deck for a character with cost less than {1} to put into play',
            effectArgs: context => [context.source.parent.getCost()]
        });
    }
}

export default DaughterOfWar;
