import { perRound } from '../../../AbilityLimit.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class WaseitsBlessing extends DrawCard {
    static id = 'waseit-s-blessing';

    setupCardAbilities() {
        this.action('Send a character home from each side')
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, sendHome())
            .target({
                name: 'oppCharacter',
                dependsOn: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, sendHome())
            .effect((context) => msg`send home ${context.targets.myCharacter} and ${context.targets.oppCharacter}`)
            .max(perRound(1));
    }
}
