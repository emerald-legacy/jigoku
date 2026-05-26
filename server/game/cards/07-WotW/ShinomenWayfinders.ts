import DrawCard from '../../drawcard.js';
import { Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinomenWayfinders extends DrawCard {
    static id = 'shinomen-wayfinders';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
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
