import { msg } from '../../../GameChat.js';
import { CardType, Location, Players, Trait } from '../../../Constants.js';
import { reduceCost } from '../../../effects.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class Hayate extends DrawCard {
    static id = 'hayate';

    override setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_, player) =>
                    player.cardsInPlay.reduce(
                        (cavCount, card) => (card.hasTrait(Trait.Cavalry) ? cavCount + 1 : cavCount),
                        0
                    ),
                match: (card, source) => card === source
            })
        });

        // Hayate isn't chosen: the ability works while either character can move in
        this.conflictAction('Move this and another character to the conflict', { evenFromHome: true })
            .condition((context) =>
                context.player.cardsInPlay.some((card) => moveToConflict().canAffect(card, context)))
            .target({
                name: 'optional',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, moveToConflict())
            .moveToConflict((context) => ({ target: context.source }))
            .chatText((context) => msg`move ${context.source}${!Array.isArray(context.targets.optional) ? ' and ' : ''}${!Array.isArray(context.targets.optional) ? context.targets.optional : ''} into the conflict`);
    }
}
