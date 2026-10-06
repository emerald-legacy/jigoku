import DrawCard from '../../../DrawCard.js';
import { honor } from '../../../GameActions/GameActions.js';

class DojiAspirant extends DrawCard {
    static id = 'doji-aspirant';

    setupCardAbilities() {
        this.reaction('Honor this character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(honor());
    }
}


export default DojiAspirant;
