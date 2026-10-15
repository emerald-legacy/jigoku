import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import { attach } from '../../GameActions/GameActions.js';

class ShinjoSaddle extends DrawCard {
    static id = 'shinjo-saddle';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: Trait.Cavalry
        });

        this.action('Move to another character')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Cavalry)
            }, attach((context) => ({ attachment: context.source })));
    }
}


export default ShinjoSaddle;
