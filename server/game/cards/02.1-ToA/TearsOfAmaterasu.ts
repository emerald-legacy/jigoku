import { ProvinceCard } from '../../ProvinceCard.js';
import { gainFate } from '../../GameActions/GameActions.js';

export default class TearsOfAmaterasu extends ProvinceCard {
    static id = 'tears-of-amaterasu';

    setupCardAbilities() {
        this.reaction('Gain fate equal to the number of attackers')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(gainFate((context) => ({
                amount: context.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0
            })));
    }
}
