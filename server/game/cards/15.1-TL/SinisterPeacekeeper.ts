import DrawCard from '../../DrawCard.js';

class SinisterPeacekeeper extends DrawCard {
    static id = 'sinister-peacekeeper';

    setupCardAbilities() {
        this.reaction('Make opponent lose an honor')
            .when({
                onModifyHonor: (event, context) =>
                    event.amount > 0 && event.player === context.player.opponent,
                onTransferHonor: (event, context) => event.player === context.player && event.amount > 0
            })
            .loseHonor((context) => ({ target: context.player.opponent }));
    }
}


export default SinisterPeacekeeper;
