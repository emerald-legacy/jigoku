import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Hayate extends DrawCard {
    static id = 'hayate';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (_, player) =>
                    (player.cardsInPlay).reduce(
                        (cavCount: number, card: DrawCard) => (card.hasTrait('cavalry') ? cavCount + 1 : cavCount),
                        0
                    ),
                match: (card, source) => card === source
            })
        });

        this.action('Move this and another character to the conflict')
            .target('self', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card === context.source
            }, AbilityDsl.actions.moveToConflict())
            .target('optional', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, AbilityDsl.actions.moveToConflict())
            .effect('move {0}{1}{2} into the conflict', (context) => [
                !Array.isArray(context.targets.optional) ? ' and ' : '',
                !Array.isArray(context.targets.optional) ? context.targets.optional : ''
            ]);
    }
}
