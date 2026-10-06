import { Players, CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';
import { BaseOni } from './_BaseOni.js';

export default class FouleyesElite extends BaseOni {
    static id = 'fouleye-s-elite';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Bow a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill()
            }, bow());
    }
}
