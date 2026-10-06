import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class SilentSkirmisher extends DrawCard {
    static id = 'silent-skirmisher';

    setupCardAbilities() {
        this.action('Sacrifice another for +2 military')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }))
            .condition(context => context.game.isDuringConflict())
            .gameAction(cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .effect(() => msg`give itself +2${'military'}`);
    }
}


export default SilentSkirmisher;

