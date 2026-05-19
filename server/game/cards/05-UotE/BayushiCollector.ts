import DrawCard from '../../drawcard.js';
import { CardTypes, CharacterStatus } from '../../Constants.js';

class BayushiCollector extends DrawCard {
    static id = 'bayushi-collector';

    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment and a status token',
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.type === CardTypes.Character && card.parent.isDishonored,
                gameAction: [ability.actions.discardFromPlay(),
                    ability.actions.discardStatusToken(context => ({
                        target: context.target.parent.getStatusToken(CharacterStatus.Dishonored)
                    }))
                ]
            }
        });
    }
}


export default BayushiCollector;
