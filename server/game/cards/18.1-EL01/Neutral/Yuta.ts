import DrawCard from '../../../DrawCard.js';

class Yuta extends DrawCard {
    static id = 'yuta';

    override setupCardAbilities() {
        this.reaction('Steal a fate')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source) && context.source.isAttacking()
            })
            .takeFate();
    }
}

export default Yuta;
