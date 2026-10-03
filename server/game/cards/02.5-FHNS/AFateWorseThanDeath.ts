import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AFateWorseThanDeath extends DrawCard {
    static id = 'a-fate-worse-than-death';

    setupCardAbilities() {
        this.action('Bow, move home, dishonor, remove a fate and blank a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor(), AbilityDsl.actions.removeFate(), AbilityDsl.actions.sendHome(), AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            }))
            .effect('bow, dishonor, blank, move home, and remove a fate from {0}');
    }
}


export default AFateWorseThanDeath;
