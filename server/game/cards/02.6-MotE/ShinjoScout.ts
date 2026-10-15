import DrawCard from '../../DrawCard.js';

class ShinjoScout extends DrawCard {
    static id = 'shinjo-scout';

    override setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onPassDuringDynasty: (event, context) => event.player === context.player && event.firstToPass
            })
            .gainFate();
    }
}


export default ShinjoScout;
