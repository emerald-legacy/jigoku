import DrawCard from '../../../DrawCard.js';

class DojiAspirant extends DrawCard {
    static id = 'doji-aspirant';

    override setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .honor();
    }
}


export default DojiAspirant;
