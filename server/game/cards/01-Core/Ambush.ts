import DrawCard from '../../drawcard.js';
import { Locations, Players, TargetModes, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Ambush extends DrawCard {
    static id = 'ambush';

    setupCardAbilities() {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            target: {
                activePromptTitle: 'Choose up to two characters',
                numCards: 2,
                mode: TargetModes.MaxStat,
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                cardType: CardTypes.Character,
                location: [Locations.Hand, Locations.Provinces],
                controller: Players.Self,
                cardCondition: card => card.isFaction('scorpion'),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}


export default Ambush;
