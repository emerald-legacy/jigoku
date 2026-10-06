import { CardType } from '../../Constants.js';
import { bow, conditional, dishonor, draw, sequential } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AsakoMaezawa2 extends DrawCard {
    static id = 'asako-maezawa-2';

    public setupCardAbilities() {
        this.reaction('Bow a character with no fate')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.getFate() === 0
            }, sequential([
                bow(),
                conditional({
                    condition: (context) => !!context.target?.isFaction('phoenix'),
                    trueGameAction: dishonor(),
                    falseGameAction: draw({ amount: 0 }) //do nothing
                })
            ]))
            .effect('bow {0}');
    }
}
