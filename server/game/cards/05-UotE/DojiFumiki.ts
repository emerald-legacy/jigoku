import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class DojiFumiki extends DrawCard {
    static id = 'doji-fumiki';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow a dishonored character',
            condition: (context: AbilityContext) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isDishonored && card.isParticipating(),
                gameAction: ability.actions.bow()
            }
        });
    }
}


export default DojiFumiki;
