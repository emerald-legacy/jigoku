import DrawCard from '../../drawcard.js';
import { Phases, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MiyaMystic extends DrawCard {
    static id = 'miya-mystic';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Sacrifice to discard an attachment',
            cost: ability.costs.sacrificeSelf(),
            phase: Phases.Conflict,
            target: {
                cardType: CardTypes.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default MiyaMystic;


