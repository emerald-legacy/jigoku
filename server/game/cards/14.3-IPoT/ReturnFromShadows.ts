import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ReturnFromShadows extends DrawCard {
    static id = 'return-from-shadows';

    setupCardAbilities() {
        this.reaction({
            title: 'Blank and reveal a province',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                afterConflict: (event, context) => event.conflict && event.conflict.winner === context.player && event.conflict.conflictUnopposed
            },
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card, context) => Boolean(context.game.currentConflict && context.game.currentConflict.loser && card.controller === context.game.currentConflict.loser),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            }
        });
    }
}


export default ReturnFromShadows;
