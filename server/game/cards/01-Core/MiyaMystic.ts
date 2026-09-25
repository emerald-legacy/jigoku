import DrawCard from '../../DrawCard.js';
import { Phases, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MiyaMystic extends DrawCard {
    static id = 'miya-mystic';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Sacrifice to discard an attachment')
            .cost(ability.costs.sacrificeSelf())
            .target('target', {
                cardType: CardType.Attachment
            }, ability.actions.discardFromPlay())
            .phase(Phases.Conflict);
    }
}


export default MiyaMystic;


