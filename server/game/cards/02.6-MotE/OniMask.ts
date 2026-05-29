import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class OniMask extends DrawCard {
    static id = 'oni-mask';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Blank participating character',
            cost: ability.costs.removeFateFromParent(),

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.blank() })
            },
            effect: 'blank {0} until the end of the conflict'
        });
    }
}


export default OniMask;
