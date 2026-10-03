import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YasukiOguri2 extends DrawCard {
    static id = 'yasuki-oguri-2';

    setupCardAbilities() {
        this.action('Move a character in')
            .cost(AbilityDsl.costs.payFate(1))
            .condition(context => context.source.isDefending())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.getFate() > 0
            }, AbilityDsl.actions.moveToConflict());
    }
}


export default YasukiOguri2;
