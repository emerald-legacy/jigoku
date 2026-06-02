import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoTatsuo extends DrawCard {
    static id = 'shinjo-tatsuo';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move this and another character to the conflict',
            targets: {
                self: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card === context.source,
                    gameAction: ability.actions.moveToConflict()
                },
                optional: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card !== context.source,
                    optional: true,
                    gameAction: ability.actions.moveToConflict()
                }
            },
            effect: 'move {0}{1}{2} into the conflict',
            effectArgs: context => [
                !Array.isArray(context.targets.optional) ? ' and ' : '',
                !Array.isArray(context.targets.optional) ? context.targets.optional : '']
        });
    }
}


export default ShinjoTatsuo;
