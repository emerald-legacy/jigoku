import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoSaddle extends DrawCard {
    static id = 'shinjo-saddle';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true,
            trait: 'cavalry'
        });

        this.action({
            title: 'Move to another character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry'),
                gameAction: ability.actions.attach(context => ({ attachment: context.source }))
            }
        });
    }
}


export default ShinjoSaddle;
