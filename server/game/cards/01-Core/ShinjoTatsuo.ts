import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class ShinjoTatsuo extends DrawCard {
    static id = 'shinjo-tatsuo';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this and another character to the conflict',
            targets: {
                self: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card === context.source,
                    gameAction: ability.actions.moveToConflict()
                },
                optional: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card !== context.source,
                    optional: true,
                    gameAction: ability.actions.moveToConflict()
                }
            },
            effect: 'move {0}{1}{2} into the conflict',
            effectArgs: context => [
                context.targets.optional.length !== 0 ? ' and ' : '',
                context.targets.optional.length !== 0 ? context.targets.optional : '']
        });
    }
}


export default ShinjoTatsuo;
