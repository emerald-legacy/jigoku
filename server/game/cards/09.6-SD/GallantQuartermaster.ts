import DrawCard from '../../DrawCard.js';

class GallantQuartermaster extends DrawCard {
    static id = 'gallant-quartermaster';

    setupCardAbilities() {
        this.interrupt('Gain two fate')
            .when({
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source
            })
            .gainFate(2);
    }
}


export default GallantQuartermaster;
