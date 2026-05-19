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
                amount: (card, player) => {
                    return player.filterCardsInPlay(card => {
                        return card.isParticipating() && card.isFaction('unicorn');
                    }).length;
                },
                match: (card, source) => card === source
            })
        });
    }
}


export default ShinomenWayfinders;
