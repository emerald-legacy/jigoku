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
                    player.charactersInPlay.reduce(
                        (cavCount, card) => (card.hasTrait(Trait.Cavalry) ? cavCount + 1 : cavCount),
                        0
                    ),
                match: (card, source) => card === source
            })
        });

        // Hayate isn't chosen: the ability works while either character can move in.
        // While Hayate is participating, choosing no one would change nothing (RRG Target), so a character must be chosen.
        this.conflictAction('Move this and another character to the conflict', { evenFromHome: true })
            .condition((context) =>
                context.player.charactersInPlay.some((card) => moveToConflict().canAffect(card, context)))
            .skippableTarget({
                name: 'required',
                cardType: CardType.Character,
                controller: Players.Self,
                skipIf: (context) => !context.source.isParticipating(),
                cardCondition: (card, context) => card !== context.source
            }, moveToConflict())
            .target({
                name: 'optional',
                cardType: CardType.Character,
                controller: Players.Self,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => card !== context.source && !context.source.isParticipating()
            }, moveToConflict())
            .moveToConflict((context) => ({ target: context.source }))
            .chatText((context) => {
                const moved = [context.source.isParticipating() ? [] : context.source, context.targets.required, context.targets.optional];
                return msg`move ${moved.flat().filter((card) => card !== undefined)} into the conflict`;
            });
    }
}
