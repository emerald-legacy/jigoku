import DrawCard from '../../DrawCard.js';

class ShinjoOutrider extends DrawCard {
    static id = 'shinjo-outrider';

    override setupCardAbilities() {
        this.action('Move this character to conflict')
            .moveToConflict();
    }
}


export default ShinjoOutrider;
