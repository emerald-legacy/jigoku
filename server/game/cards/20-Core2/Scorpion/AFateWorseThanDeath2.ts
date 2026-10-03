import { CardType, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class AFateWorseThanDeath2 extends DrawCard {
    static id = 'a-fate-worse-than-death-2';

    setupCardAbilities() {
        this.action('Bow, move home, dishonor, remove a fate and blank a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor(), AbilityDsl.actions.removeFate(), AbilityDsl.actions.sendHome(), AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            }))
            .effect('bow, dishonor, blank, move home, and remove a fate from {0}');
    }
}
