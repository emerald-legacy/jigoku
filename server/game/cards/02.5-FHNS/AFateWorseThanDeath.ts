import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import { blank } from '../../effects.js';
import { bow, cardLastingEffect, dishonor, removeFate, sendHome } from '../../GameActions/GameActions.js';

class AFateWorseThanDeath extends DrawCard {
    static id = 'a-fate-worse-than-death';

    setupCardAbilities() {
        this.action('Bow, move home, dishonor, remove a fate and blank a character')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, bow(), dishonor(), removeFate(), sendHome(), cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .effect('bow, dishonor, blank, move home, and remove a fate from {0}');
    }
}


export default AFateWorseThanDeath;
