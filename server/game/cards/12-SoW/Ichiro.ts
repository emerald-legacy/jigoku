import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class Ichiro extends DrawCard {
    static id = 'ichiro';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            match: (card) => card.getType() === CardType.Character && card.attachments.length > 0,
            effect: [AbilityDsl.effects.cardCannot('honor'), AbilityDsl.effects.cardCannot('dishonor')]
        });
    }
}
