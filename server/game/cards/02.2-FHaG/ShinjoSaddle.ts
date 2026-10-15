import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { attach } from '../../GameActions/GameActions.js';

class ShinjoSaddle extends DrawCard {
    static id = 'shinjo-saddle';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'cavalry'
        });

        this.action('Move to another character')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry')
            }, attach((context) => ({ attachment: context.source })));
    }
}


export default ShinjoSaddle;
