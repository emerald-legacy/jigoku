import { msg } from '../../../GameChat.js';
import { CardType, Location } from '../../../Constants.js';
import { handler, putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { AshigaruRecruit } from '../../AshigaruRecruit.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Event } from '../../../Events/Event.js';

/** The token as the chat shows it: a card fragment, so its name can be hovered. */
const recruitInChat = {
    id: 'ashigaru-recruit',
    label: 'Ashigaru Recruit',
    name: 'Ashigaru Recruit',
    facedown: false,
    type: CardType.Character
};

function putAshigaruTokenIntoPlay(context: AbilityContext) {
    const card = context.player.dynastyDeck[0];
    const token = context.game.createToken(card, AshigaruRecruit);
    card.owner.removeCardFromPile(card);
    card.moveTo(Location.RemovedFromGame);
    const moveEvents: Event[] = [];
    putIntoPlay({ target: token }).addEventsToArray(moveEvents, context);
    context.game.openThenEventWindow(moveEvents);
    return true;
}

export default class AshigaruEncampment extends DrawCard {
    static id = 'ashigaru-encampment';

    setupCardAbilities() {
        this.action('Recruit a fresh Ashigaru')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .gameAction(handler({ handler: putAshigaruTokenIntoPlay }))
            .chatText(() => msg`recruit ${recruitInChat}`);
    }
}
