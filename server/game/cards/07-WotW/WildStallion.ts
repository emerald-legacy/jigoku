import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class WildStallion extends DrawCard {
    static id = 'wild-stallion';

    setupCardAbilities() {
        this.action('Move this and another character to the conflict')
            .condition(context => !!(context.game.currentConflict && !context.source.isParticipating()))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true
            }, AbilityDsl.actions.moveToConflict())
            .gameAction(AbilityDsl.actions.moveToConflict())
            .effect('move {0}{1}{2} into the conflict', context => {
                const t = context.targets.target;
                const hasAny = Array.isArray(t) ? t.length > 0 : !!t;
                return [hasAny ? ' and ' : '', context.source];
            });
    }
}


export default WildStallion;
