import { TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../conflict.js';
import DrawCard from '../../../drawcard.js';
import type Ring from '../../../ring.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

function isamuWentHome(event: any, context: TriggeredAbilityContext<ShinjoIsamu>) {
    return event.card === context.source;
}

export default class ShinjoIsamu extends DrawCard {
    static id = 'shinjo-isamu';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve a ring effect',
            when: {
                onSendHome: isamuWentHome,
                onReturnHome: isamuWentHome
            },
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context: AbilityContext) =>
                    (context.game.currentConflict as Conflict)
                        .getConflictProvinces()
                        .some((province: ProvinceCard) => province.getElement().includes(ring.element)),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            },
            effect: 'resolve the {0} effect'
        });
    }
}
