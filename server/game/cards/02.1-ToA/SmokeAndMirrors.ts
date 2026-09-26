import DrawCard from '../../DrawCard.js';
import { Players, CardType, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SmokeAndMirrors extends DrawCard {
    static id = 'smoke-and-mirrors';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move shinobi home')
            .condition(context => context.player.isAttackingPlayer())
            .targetCards('target', {
                mode: TargetMode.Unlimited,
                activePromptTitle: 'Choose characters',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('shinobi') && card.isAttacking()
            }, ability.actions.sendHome());
    }
}


export default SmokeAndMirrors;
