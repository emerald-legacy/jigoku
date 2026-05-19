import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YasukiOguri2 extends DrawCard {
    static id = 'yasuki-oguri-2';

    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            condition: context => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.moveToConflict(),
                cardCondition: card => card.getFate() > 0
            },
            cost: AbilityDsl.costs.payFate(1)
        });
    }
}


export default YasukiOguri2;
