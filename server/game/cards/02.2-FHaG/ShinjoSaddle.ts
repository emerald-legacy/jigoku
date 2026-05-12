import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class ShinjoSaddle extends DrawCard {
    static id = 'shinjo-saddle';

    setupCardAbilities(ability) {
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
