import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

class DojiAspirant extends DrawCard {
    static id = 'doji-aspirant';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor this character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.honor()
        });
    }
}


export default DojiAspirant;
