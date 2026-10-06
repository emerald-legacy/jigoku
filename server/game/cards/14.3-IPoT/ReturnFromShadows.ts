import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { dishonorProvince, reveal, sequential } from '../../GameActions/GameActions.js';

class ReturnFromShadows extends DrawCard {
    static id = 'return-from-shadows';

    setupCardAbilities() {
        this.reaction('Blank and reveal a province')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictUnopposed
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card, context) => Boolean(context.game.currentConflict && context.game.currentConflict.loser && card.controller === context.game.currentConflict.loser)
            }, sequential([
                dishonorProvince(),
                reveal({ chatMessage: true })
            ]))
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default ReturnFromShadows;
