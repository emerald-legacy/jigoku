import { CardType, ConflictType, Trait } from '../../../Constants.js';
import { gainAbility } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class MagariYari extends DrawCard {
    static id = 'magari-yari';

    override setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait(Trait.Bushi),
            effect: gainAbility.reaction('Bow a character', (ability) => ability
                .when({
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        event.card.isParticipating() &&
                        event.card.militarySkill < context.source.militarySkill
                })
                .bow((context) => ({ target: context.event.card })))
        });
    }
}
