import AbilityDsl from '../../../abilitydsl.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

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
            .effect('send home {1} and {2}', (context) => [context.targets.myCharacter, context.targets.oppCharacter])
            .max(AbilityDsl.limit.perRound(1));
    }
}
