import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes, CharacterStatus } from '../../Constants.js';

class CourtOfDeception extends DrawCard {
    static id = 'court-of-deception';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard a dishonored character\'s status token',
            condition: (context: any) => context.player.honor <= 6,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card: any) => card.isDishonored && !card.isParticipating(),
                gameAction: ability.actions.discardStatusToken((context: any) => ({ target: context.target.getStatusToken(CharacterStatus.Dishonored) }))
            }
        });
    }
}


export default CourtOfDeception;
