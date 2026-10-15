import DrawCard from '../../DrawCard.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    setupCardAbilities() {
        this.action('Move this character home')
            .sendHome();
    }
}


export default DojiRepresentative;
