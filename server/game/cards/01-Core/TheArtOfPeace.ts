import { ProvinceCard } from '../../ProvinceCard.js';
import { dishonor, honor } from '../../GameActions/GameActions.js';

export default class TheArtOfPeace extends ProvinceCard {
    static id = 'the-art-of-peace';

    setupCardAbilities() {
        this.interrupt('Honor all defenders and dishonor all attackers')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gameAction(
                dishonor((context) => ({ target: context.game.currentConflict?.getAttackers() ?? [] })),
                honor((context) => ({ target: context.game.currentConflict?.getDefenders() ?? [] }))
            )
            .effect('dishonor all attackers and honor all defenders in this conflict');
    }
}
