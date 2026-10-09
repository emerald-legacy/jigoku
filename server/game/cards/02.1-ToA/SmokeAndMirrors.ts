import DrawCard from '../../DrawCard.js';
import { Players, CardType, TargetMode } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class SmokeAndMirrors extends DrawCard {
    static id = 'smoke-and-mirrors';

    setupCardAbilities() {
        this.action('Move shinobi home')
            .condition((context) => context.player.isAttackingPlayer())
            .targetCards({
                mode: TargetMode.Unlimited,
                activePromptTitle: 'Choose characters',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('shinobi') && card.isAttacking()
            }, sendHome());
    }
}


export default SmokeAndMirrors;
