import { ProvinceCard } from '../../../ProvinceCard.js';
import { discardAtRandom } from '../../../GameActions/GameActions.js';

export default class CavernsOfStolenHope extends ProvinceCard {
    static id = 'caverns-of-stolen-hope';

    setupCardAbilities() {
        this.reaction('Force opponent to discard random cards equal to the number of attackers')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(discardAtRandom((context) => ({
                amount: context.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0
            })));
    }
}
