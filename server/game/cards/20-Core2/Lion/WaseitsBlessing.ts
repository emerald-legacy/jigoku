import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class WaseitsBlessing extends DrawCard {
    static id = 'waseit-s-blessing';

    setupCardAbilities() {
        this.action('Send a character home from each side')
            .target('myCharacter', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, AbilityDsl.actions.sendHome())
            .target('oppCharacter', {
                dependsOn: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.sendHome())
            .effect('send home {1} and {2}', (context) => [context.targets.myCharacter, context.targets.oppCharacter])
            .max(AbilityDsl.limit.perRound(1));
    }
}
