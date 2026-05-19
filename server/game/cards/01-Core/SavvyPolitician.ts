import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class SavvyPolitician extends DrawCard {
    static id = 'savvy-politician';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character',
            when: {
                onCardHonored: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default SavvyPolitician;
