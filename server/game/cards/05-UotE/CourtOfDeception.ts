import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes, CharacterStatus } from '../../Constants.js';

class CourtOfDeception extends DrawCard {
    static id = 'court-of-deception';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard a dishonored character\'s status token',
            condition: (context: AbilityContext) => context.player.honor <= 6,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: any) => card.isDishonored && !card.isParticipating(),
                gameAction: ability.actions.discardStatusToken((context: AbilityContext) => ({ target: (context.target as DrawCard).getStatusToken(CharacterStatus.Dishonored) }))
            }
        });
    }
}


export default CourtOfDeception;
