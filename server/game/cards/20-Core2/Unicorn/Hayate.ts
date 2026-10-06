import { CardType, Location, Players } from '../../../Constants.js';
import { reduceCost } from '../../../effects.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class Hayate extends DrawCard {
    static id = 'hayate';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.reduce(
                        (cavCount, card) => (card.hasTrait('cavalry') ? cavCount + 1 : cavCount),
                        0
                    ),
                match: (card, source) => card === source
            })
        });

        this.action('Move this and another character to the conflict')
            .target({
                name: 'self',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card === context.source
            }, moveToConflict())
            .target({
                name: 'optional',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, moveToConflict())
            .effect('move {0}{1}{2} into the conflict', (context) => [
                !Array.isArray(context.targets.optional) ? ' and ' : '',
                !Array.isArray(context.targets.optional) ? context.targets.optional : ''
            ]);
    }
}
