import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes, CharacterStatus } from '../../Constants.js';

class BayushiCollector extends DrawCard {
    static id = 'bayushi-collector';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard an attachment and a status token',
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card: any) => card.parent && card.parent.type === CardTypes.Character && card.parent.isDishonored,
                gameAction: [ability.actions.discardFromPlay(),
                    ability.actions.discardStatusToken((context: any) => ({
                        target: context.target.parent.getStatusToken(CharacterStatus.Dishonored)
                    }))
                ]
            }
        });
    }
}


export default BayushiCollector;
