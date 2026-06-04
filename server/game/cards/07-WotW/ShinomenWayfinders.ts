import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinomenWayfinders extends DrawCard {
    static id = 'shinomen-wayfinders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.filterCardsInPlay((card) => {
                        return card.isParticipating() && card.isFaction('unicorn');
                    }).length;
                },
                match: (card, source) => card === source
            })
        });
    }
}


export default ShinomenWayfinders;
