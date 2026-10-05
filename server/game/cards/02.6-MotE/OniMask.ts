import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OniMask extends DrawCard {
    static id = 'oni-mask';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Blank participating character')
            .cost(AbilityDsl.costs.removeFateFromParent())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.blank() }))
            .effect('blank {0} until the end of the conflict');
    }
}


export default OniMask;
