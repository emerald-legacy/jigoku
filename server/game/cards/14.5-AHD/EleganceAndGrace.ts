import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes, CardTypes, Players } from '../../Constants.js';

class EleganceAndGrace extends DrawCard {
    static id = 'elegance-and-grace';

    setupCardAbilities() {
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetModes.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 2,
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isHonored,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default EleganceAndGrace;
