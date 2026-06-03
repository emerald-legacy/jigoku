import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
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
                cardType: CardType.Character,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default SavvyPolitician;
