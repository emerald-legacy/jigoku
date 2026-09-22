import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType } from '../../Constants.js';

class BayushiDairu extends DrawCard {
    static id = 'bayushi-dairu';

    setupCardAbilities() {
        this.action({
            title: 'Move a status token to this character',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetMode.Token,
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.moveStatusToken((context: AbilityContext<DrawCard, DrawCard>) => ({ recipient: context.source }))
            }
        });
    }
}


export default BayushiDairu;
