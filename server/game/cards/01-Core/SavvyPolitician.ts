import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SavvyPolitician extends DrawCard {
    static id = 'savvy-politician';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onCardHonored: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character
            }, AbilityDsl.actions.honor());
    }
}


export default SavvyPolitician;
