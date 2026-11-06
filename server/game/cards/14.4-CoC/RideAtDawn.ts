import DrawCard from '../../DrawCard.js';

class RideAtDawn extends DrawCard {
    static id = 'ride-at-dawn';

    override setupCardAbilities() {
        this.reaction('Make opponent discard a card')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player && context.player.opponent && !context.player.opponent.passedDynasty
            })
            .discardAtRandom();
    }
}


export default RideAtDawn;
