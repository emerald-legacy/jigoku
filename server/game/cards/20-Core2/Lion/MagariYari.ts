import { AbilityType, CardType, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MagariYari extends DrawCard {
    static id = 'magari-yari';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('bushi'),
            effect: AbilityDsl.effects.gainAbility<DrawCard>(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        event.card.isParticipating() &&
                        event.card.getMilitarySkill() < context.source.getMilitarySkill()
                },
                gameAction: AbilityDsl.actions.bow((context) => ({ target: context.event.card }))
            })
        });
    }
}
