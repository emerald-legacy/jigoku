import AbilityDsl from '../../../abilitydsl';
import { StrongholdCard } from '../../../StrongholdCard';

export default class TheatreOfHonestLies extends StrongholdCard {
    static id = 'theatre-of-honest-lies';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount > 0
            },
            cost: AbilityDsl.costs.bowSelf(),
            gameAction: AbilityDsl.actions.draw()
        });

        this.reaction({
            title: 'Take 1 honor',
            when: {
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount > 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount < 0
            },
            cost: AbilityDsl.costs.bowSelf(),
            gameAction: AbilityDsl.actions.takeHonor()
        });
    }
}
