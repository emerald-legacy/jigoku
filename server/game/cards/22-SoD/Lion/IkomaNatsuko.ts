import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class IkomaNatsuko extends DrawCard {
    static id = 'ikoma-natsuko';

    setupCardAbilities() {
        this.action({
            title: 'Bow and send home a participating character',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.discardImperialFavor(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: [AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome()]
            },
            effect: 'bow and send {0} home'
        });
    }
}
