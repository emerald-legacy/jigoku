import { CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class Harmonize extends DrawCard {
    static id = 'harmonize';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Send a character home from each side')
            .target('myCharacter', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isDefending() && card.controller === context.player
            }, ability.actions.sendHome())
            .target('oppCharacter', {
                dependsOn: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.costLessThan(((context.targets.myCharacter).getCost() ?? 0) + 1)
            }, ability.actions.sendHome())
            .effect('send home {1} and {2}', context => [context.targets.myCharacter, context.targets.oppCharacter])
            .cannotBeMirrored();
    }
}


export default Harmonize;
