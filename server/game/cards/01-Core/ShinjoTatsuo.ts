import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoTatsuo extends DrawCard {
    static id = 'shinjo-tatsuo';

    setupCardAbilities() {
        this.action('Move this and another character to the conflict')
            .target({
                name: 'self',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card === context.source
            }, AbilityDsl.actions.moveToConflict())
            .target({
                name: 'optional',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, AbilityDsl.actions.moveToConflict())
            .effect('move {0}{1}{2} into the conflict', context => [
                !Array.isArray(context.targets.optional) ? ' and ' : '',
                !Array.isArray(context.targets.optional) ? context.targets.optional : '']);
    }
}


export default ShinjoTatsuo;
