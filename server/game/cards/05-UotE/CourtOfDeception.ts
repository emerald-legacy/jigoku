import { discardStatusToken } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, CharacterStatus } from '../../Constants.js';

class CourtOfDeception extends DrawCard {
    static id = 'court-of-deception';

    override setupCardAbilities() {
        this.action('Discard a dishonored character\'s status token')
            .ifCondition((context) => context.player.honor <= 6)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDishonored && !card.isParticipating()
            }, discardStatusToken((context) => ({ target: context.target.getStatusToken(CharacterStatus.Dishonored) })));
    }
}


export default CourtOfDeception;
