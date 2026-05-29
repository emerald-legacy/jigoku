import { AbilityTypes, CardTypes } from '../../../Constants.js';
import type { TriggeredAbilityContext } from "../../../TriggeredAbilityContext.js";
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';
import type { TriggeredAbilityProps } from '../../../Interfaces.js';

export default class MagariYari extends DrawCard {
    static id = 'magari-yari';

    setupCardAbilities() {
        this.whileAttached({
            match: (card: DrawCard) => card.hasTrait('bushi'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        (context.source as DrawCard).isParticipating('military') &&
                        event.card.type === CardTypes.Character &&
                        event.card.isParticipating() &&
                        event.card.getMilitarySkill() < context.source.getMilitarySkill()
                },
                gameAction: AbilityDsl.actions.bow((context) => ({ target: (context as TriggeredAbilityContext).event.card }))
            } as TriggeredAbilityProps)
        });
    }
}
