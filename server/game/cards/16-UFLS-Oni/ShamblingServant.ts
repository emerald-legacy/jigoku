import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { taint } from '../../GameActions/GameActions.js';

export default class ShamblingServant extends BaseOni {
    static id = 'shambling-servant';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Taint a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, taint());
    }
}
