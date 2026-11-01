import DrawCard from '../../../DrawCard.js';
import { CardType } from '../../../Constants.js';

class MantisBootlegger extends DrawCard {
    static id = 'mantis-bootlegger';

    override setupCardAbilities() {
        this.action('Gain 1 fate')
            .ifCondition((context) => context.player.cardsInPlay.filter(
                (card) => card.type === CardType.Character && card.attachments.length > 0
            ).length >= 3)
            .gainFate();
    }
}

export default MantisBootlegger;
