import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SmokeAndMirrors extends DrawCard {
    static id = 'smoke-and-mirrors';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move shinobi home',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                activePromptTitle: 'Choose characters',
                numCards: 0,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('shinobi') && card.isAttacking(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default SmokeAndMirrors;
