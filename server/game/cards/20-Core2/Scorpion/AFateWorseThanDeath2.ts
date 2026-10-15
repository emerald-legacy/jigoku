import { CardType, Duration } from '../../../Constants.js';
import { blank } from '../../../effects.js';
import { bow, cardLastingEffect, dishonor, removeFate, sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AFateWorseThanDeath2 extends DrawCard {
    static id = 'a-fate-worse-than-death-2';

    setupCardAbilities() {
        this.action('Bow, move home, dishonor, remove a fate and blank a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, bow(), dishonor(), removeFate(), sendHome(), cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .chatText('bow, dishonor, blank, move home, and remove a fate from {0}');
    }
}
