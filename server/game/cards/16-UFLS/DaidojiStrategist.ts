import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DaidojiStrategist extends DrawCard {
    static id = 'daidoji-strategist';

    setupCardAbilities() {
        this.action({
            title: 'Move an honored character home',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isHonored,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

export default DaidojiStrategist;

