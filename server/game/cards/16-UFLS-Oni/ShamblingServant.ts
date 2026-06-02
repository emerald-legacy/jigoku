import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShamblingServant extends BaseOni {
    static id = 'shambling-servant';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Taint a character',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            target: {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }
}
