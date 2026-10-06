import { Players, CardType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class Ichiro extends DrawCard {
    static id = 'ichiro';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            match: (card) => card.getType() === CardType.Character && card.attachments.length > 0,
            effect: [cardCannot('honor'), cardCannot('dishonor')]
        });
    }
}
