import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SinisterPeacekeeper extends DrawCard {
    static id = 'sinister-peacekeeper';

    setupCardAbilities() {
        this.reaction('Make opponent lose an honor')
            .when({
                onModifyHonor: (event, context) =>
                    (event.amount ?? 0) > 0 && context.player.opponent &&
                    event.player === context.player.opponent,
                onTransferHonor: (event, context) => event.player === context.player && (event.amount ?? 0) > 0
            })
            .gameAction(AbilityDsl.actions.loseHonor((context) => ({
                target: context.player.opponent
            })));
    }
}


export default SinisterPeacekeeper;
