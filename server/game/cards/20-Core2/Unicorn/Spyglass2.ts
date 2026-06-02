import AbilityDsl from '../../../abilitydsl.js';
import { AbilityType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityProps } from '../../../Interfaces.js';

export default class Spyglass2 extends DrawCard {
    static id = 'spyglass-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Draw a card',
                when: {
                    onConflictDeclared: (event, context) => (event.attackers ?? []).includes(context.source),
                    onDefendersDeclared: (event, context) => (event.defenders ?? []).includes(context.source),
                    onMoveToConflict: (event, context) => event.card === context.source
                },
                gameAction: AbilityDsl.actions.draw()
            } as TriggeredAbilityProps)
        });
    }
}
