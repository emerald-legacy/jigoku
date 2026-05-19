import DrawCard from '../../../drawcard.js';
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

    numCharactersWithAttachments(context) {
        return context.player.cardsInPlay.filter(
            (card) => card.getType() === CardTypes.Character && card.attachments.length > 0
        ).length;
    }
}

export default MantisBootlegger;
