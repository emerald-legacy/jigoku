import DrawCard from '../../DrawCard.js';

class BorderRider extends DrawCard {
    static id = 'border-rider';

    override setupCardAbilities() {
        this.action('Ready this character')
            .ready();
    }
}


export default BorderRider;


