import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class IdeTadaji extends DrawCard {
    static id = 'ide-tadaji';

    setupCardAbilities() {
        this.action('Move characters into conflict')
            .condition(context => context.source.isParticipating())
            .target({
                name: 'myChar',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => !card.bowed && card.costLessThan(3)
            }, moveToConflict())
            .target({
                name: 'oppChar',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.bowed && card.costLessThan(3)
            }, moveToConflict());
    }
}


export default IdeTadaji;
