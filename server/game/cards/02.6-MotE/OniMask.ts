import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';

class OniMask extends DrawCard {
    static id = 'oni-mask';

    setupCardAbilities(ability) {
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
