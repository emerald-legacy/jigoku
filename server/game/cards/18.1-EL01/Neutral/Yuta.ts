import DrawCard from '../../../DrawCard.js';

class Yuta extends DrawCard {
    static id = 'yuta';

    setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isAttacking()
            })
            .takeFate();
    }
}

export default Yuta;
