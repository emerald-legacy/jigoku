import { CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';
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
            }, bow())
            .if((context) => !!context.target?.isFaction('phoenix'))
            .dishonor()
            .chatText('bow {0}');
    }
}
