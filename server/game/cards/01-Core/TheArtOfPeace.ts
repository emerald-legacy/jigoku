import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TheArtOfPeace extends ProvinceCard {
    static id = 'the-art-of-peace';

    setupCardAbilities() {
        this.interrupt('Honor all defenders and dishonor all attackers')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gameAction(
                AbilityDsl.actions.dishonor((context) => ({ target: context.game.currentConflict?.getAttackers() ?? [] })),
                AbilityDsl.actions.honor((context) => ({ target: context.game.currentConflict?.getDefenders() ?? [] }))
            )
            .effect('dishonor all attackers and honor all defenders in this conflict');
    }
}
