import DrawCard from '../../DrawCard.js';
import { moveStatusToken } from '../../GameActions/GameActions.js';
import { Players, CardType, CharacterStatus } from '../../Constants.js';

class OrigamiMaster extends DrawCard {
    static id = 'origami-master';

    setupCardAbilities() {
        this.action('Move an honor token')
            .condition(context => context.source.isHonored)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source
            }, moveStatusToken((context) => ({
                target: context.source.getStatusToken(CharacterStatus.Honored),
                recipient: context.target
            })));
    }
}


export default OrigamiMaster;
