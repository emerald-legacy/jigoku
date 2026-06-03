import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType, Players } from '../../Constants.js';

class EleganceAndGrace extends DrawCard {
    static id = 'elegance-and-grace';

    setupCardAbilities() {
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 2,
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isHonored,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default EleganceAndGrace;
