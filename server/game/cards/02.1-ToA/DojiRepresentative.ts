import DrawCard from '../../DrawCard.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    override setupCardAbilities() {
        this.action('Move this character home')
            .sendHome();
    }
}


export default DojiRepresentative;
