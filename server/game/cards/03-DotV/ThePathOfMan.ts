import DrawCard from '../../DrawCard.js';

class ThePathOfMan extends DrawCard {
    static id = 'the-path-of-man';

    setupCardAbilities() {
        this.reaction('Gain 2 fate')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            })
            .gainFate(2);
    }
}


export default ThePathOfMan;
