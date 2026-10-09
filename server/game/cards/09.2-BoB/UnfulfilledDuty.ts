import DrawCard from '../../DrawCard.js';
import { ready } from '../../GameActions/GameActions.js';
import { TargetMode, CardType } from '../../Constants.js';

class UnfulfilledDuty extends DrawCard {
    static id = 'unfulfilled-duty';

    setupCardAbilities() {
        this.action('Ready characters')
            .targetCards({
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                cardType: CardType.Character,
                cardCondition: (card) => card.getFate() === 0
            }, ready());
    }
}


export default UnfulfilledDuty;
