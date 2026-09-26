import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoTatsuo extends DrawCard {
    static id = 'shinjo-tatsuo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move this and another character to the conflict')
            .target('self', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card === context.source
            }, ability.actions.moveToConflict())
            .target('optional', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, ability.actions.moveToConflict())
            .effect('move {0}{1}{2} into the conflict', context => [
                !Array.isArray(context.targets.optional) ? ' and ' : '',
                !Array.isArray(context.targets.optional) ? context.targets.optional : '']);
    }
}


export default ShinjoTatsuo;
