import AbilityDsl from '../../../abilitydsl';
import { AbilityTypes, CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityProps } from '../../../Interfaces';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onMoveToConflict: (event, context) =>
                    event.card.type === CardTypes.Character &&
                    // printed cost 3 or less
                    event.card.printedCost <= 3 &&
                    // by your card effect
                    context.player === event.context.player &&
                    event.context.source.type !== 'ring'

            },
            gameAction: AbilityDsl.actions.ready((context) => ({ target: (context as any).event.card }))
        });
    }
}
