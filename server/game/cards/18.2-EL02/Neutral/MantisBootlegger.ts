import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';

class MantisBootlegger extends DrawCard {
    static id = 'mantis-bootlegger';

    setupCardAbilities() {
        this.action('Gain 1 fate')
            .condition((context) => context.player.cardsInPlay.filter(
                (card) => card.getType() === CardType.Character && card.attachments.length > 0
            ).length >= 3)
            .gainFate();
    }
}

export default MantisBootlegger;
