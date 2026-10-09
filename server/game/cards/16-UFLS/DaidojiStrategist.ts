import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class DaidojiStrategist extends DrawCard {
    static id = 'daidoji-strategist';

    setupCardAbilities() {
        this.action('Move an honored character home')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isHonored
            }, sendHome());
    }
}

export default DaidojiStrategist;

