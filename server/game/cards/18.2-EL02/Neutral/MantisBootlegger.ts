import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class MantisBootlegger extends DrawCard {
    static id = 'mantis-bootlegger';

    setupCardAbilities() {
        this.action({
            title: 'Gain 1 fate',
            condition: (context) => this.numCharactersWithAttachments(context) >= 3,
            gameAction: AbilityDsl.actions.gainFate()
        });
    }

    numCharactersWithAttachments(context: AbilityContext) {
        return context.player.cardsInPlay.filter(
            (card: any) => card.getType() === CardTypes.Character && card.attachments.length > 0
        ).length;
    }
}

export default MantisBootlegger;
