import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SavvyPolitician extends DrawCard {
    static id = 'savvy-politician';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Honor a character')
            .when({
                onCardHonored: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character
            }, ability.actions.honor());
    }
}


export default SavvyPolitician;
