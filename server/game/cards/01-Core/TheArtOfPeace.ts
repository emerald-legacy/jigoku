import { ProvinceCard } from '../../ProvinceCard.js';
import type { TriggeredAbilityContext } from "../../TriggeredAbilityContext.js";
import AbilityDsl from '../../abilitydsl.js';

export default class TheArtOfPeace extends ProvinceCard {
    static id = 'the-art-of-peace';

    setupCardAbilities() {
        this.interrupt({
            title: 'Honor all defenders and dishonor all attackers',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            effect: 'dishonor all attackers and honor all defenders in this conflict',
            gameAction: [
                AbilityDsl.actions.dishonor((context) => ({ target: (context as TriggeredAbilityContext).event.conflict?.getAttackers() ?? [] })),
                AbilityDsl.actions.honor((context) => ({ target: (context as TriggeredAbilityContext).event.conflict?.getDefenders() ?? [] }))
            ]
        });
    }
}
