import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeTadaji extends DrawCard {
    static id = 'ide-tadaji';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move characters into conflict')
            .condition(context => context.source.isParticipating())
            .target('myChar', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => !card.bowed && card.costLessThan(3)
            }, ability.actions.moveToConflict())
            .target('oppChar', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.bowed && card.costLessThan(3)
            }, ability.actions.moveToConflict());
    }
}


export default IdeTadaji;
