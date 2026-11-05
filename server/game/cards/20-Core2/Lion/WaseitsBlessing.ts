import { perRound } from '../../../AbilityLimit.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class WaseitsBlessing extends DrawCard {
    static id = 'waseit-s-blessing';

    override setupCardAbilities() {
        this.conflictAction('Send a character home from each side')
            .target({
                name: 'defender',
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, sendHome())
            .target({
                name: 'attacker',
                dependsOn: 'defender',
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, sendHome())
            .chatText((context) => msg`send home ${context.targets.defender} and ${context.targets.attacker}`)
            .max(perRound(1));
    }
}
