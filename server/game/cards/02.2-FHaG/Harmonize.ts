import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { sendHome } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class Harmonize extends DrawCard {
    static id = 'harmonize';

    override setupCardAbilities() {
        this.action('Send a character home from each side')
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isDefending() && card.controller === context.player
            }, sendHome())
            .target({
                name: 'oppCharacter',
                dependsOn: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.costAtMost(context.targets.myCharacter.getCost())
            }, sendHome())
            .chatText((context) => msg`send home ${context.targets.myCharacter} and ${context.targets.oppCharacter}`)
            .cannotBeMirrored();
    }
}


export default Harmonize;
