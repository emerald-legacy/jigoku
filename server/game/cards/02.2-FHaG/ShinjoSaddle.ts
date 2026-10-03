import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoSaddle extends DrawCard {
    static id = 'shinjo-saddle';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'cavalry'
        });

        this.action('Move to another character')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('cavalry')
            }, AbilityDsl.actions.attach((context) => ({ attachment: context.source })));
    }
}


export default ShinjoSaddle;
