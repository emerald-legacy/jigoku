import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes, CardTypes } from '../../Constants.js';

class UnfulfilledDuty extends DrawCard {
    static id = 'unfulfilled-duty';

    setupCardAbilities() {
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetModes.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                cardType: CardTypes.Character,
                cardCondition: (card) => card.getFate() === 0,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default UnfulfilledDuty;
