import { AbilityType, CardType, ConflictType } from '../../../Constants.js';
import { gainAbility } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MagariYari extends DrawCard {
    static id = 'magari-yari';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('bushi'),
            effect: gainAbility<DrawCard>(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        event.card.isParticipating() &&
                        event.card.militarySkill < context.source.militarySkill
                },
                gameAction: bow((context) => ({ target: context.event.card }))
            })
        });
    }
}
