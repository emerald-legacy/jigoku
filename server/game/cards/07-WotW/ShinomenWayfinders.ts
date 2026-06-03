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
                amount: (card: any, player: any) => {
                    return player.filterCardsInPlay((card: any) => {
                        return card.isParticipating() && card.isFaction('unicorn');
                    }).length;
                },
                match: (card: any, source: any) => card === source
            })
        });
    }
}


export default ShinomenWayfinders;
