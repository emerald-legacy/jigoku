import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Ambush extends DrawCard {
    static id = 'ambush';

    setupCardAbilities() {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            target: {
                activePromptTitle: 'Choose up to two characters',
                numCards: 2,
                mode: TargetMode.MaxStat,
                cardStat: (card: DrawCard) => card.getCost() ?? 0,
                maxStat: () => 6,
                cardType: CardType.Character,
                location: [Location.Hand, Location.Provinces],
                controller: Players.Self,
                cardCondition: card => card.isFaction('scorpion'),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}


export default Ambush;
