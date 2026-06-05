import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType } from '../../../Constants.js';
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
            card => card.getType() === CardType.Character && card.attachments.length > 0
        ).length;
    }
}

export default MantisBootlegger;
