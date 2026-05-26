import { CardTypes, Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import { AshigaruRecruit } from '../../AshigaruRecruit.js';
import type { AbilityContext } from '../../../AbilityContext.js';

function putAshigaruTokenIntoPlay(context: AbilityContext) {
    const card = context.player.dynastyDeck[0];
    const token = context.game.createToken(card, AshigaruRecruit);
    card.owner.removeCardFromPile(card);
    card.moveTo(Locations.RemovedFromGame);
    const moveEvents: any[] = [];
    context.game.actions.putIntoPlay({ target: token }).addEventsToArray(moveEvents, context);
    context.game.openThenEventWindow(moveEvents);
    return true;
}

export default class AshigaruEncampment extends DrawCard {
    static id = 'ashigaru-encampment';

    setupCardAbilities() {
        this.action({
            title: 'Recruit a fresh Ashigaru',
            effect: 'recruit {1}!',
            effectArgs: {
                id: 'ashigaru-recruit',
                label: 'Ashigaru Recruit',
                name: 'Ashigaru Recruit',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.handler({ handler: putAshigaruTokenIntoPlay })
        });
    }
}
