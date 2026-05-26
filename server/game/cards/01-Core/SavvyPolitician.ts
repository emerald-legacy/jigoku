import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SavvyPolitician extends DrawCard {
    static id = 'savvy-politician';

    setupCardAbilities(ability: typeof AbilityDsl) {
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
