import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType, CharacterStatus } from '../../Constants.js';

class OrigamiMaster extends DrawCard {
    static id = 'origami-master';

    setupCardAbilities() {
        this.action({
            title: 'Move an honor token',
            condition: context => context.source.isHonored,
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.moveStatusToken(context => ({
                    target: context.source.getStatusToken(CharacterStatus.Honored),
                    recipient: context.target
                }))
            }
        });
    }
}


export default OrigamiMaster;
