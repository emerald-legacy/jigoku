import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { dishonor } from '../../GameActions/GameActions.js';

export default class LostSamurai extends BaseOni {
    static id = 'lost-samurai';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Dishonor a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && !card.isFaction('shadowlands')
            }, dishonor());
    }
}
