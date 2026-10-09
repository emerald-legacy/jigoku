import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { CardType, DeckType} from '../../Constants.js';

class DaughterOfWar extends DrawCard {
    static id = 'daughter-of-war';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });
        this.interrupt('Put a character into play')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source.parentCharacter
            })
            .deckSearch((context) => ({
                activePromptTitle: 'Choose a character to put into play',
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.type === CardType.Character && card.costLessThan(context.source.parentCharacter?.getCost() ?? 0),
                gameAction: putIntoPlay()
            }))
            .chatText((context) => msg`search their deck for a character with cost less than ${context.source.parentCharacter?.getCost() ?? 0} to put into play`);
    }
}

export default DaughterOfWar;
