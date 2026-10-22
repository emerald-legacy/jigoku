import { ProvinceCard } from '../../../ProvinceCard.js';

export default class CavernsOfStolenHope extends ProvinceCard {
    static id = 'caverns-of-stolen-hope';

    override setupCardAbilities() {
        this.reaction('Force opponent to discard random cards equal to the number of attackers')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .discardAtRandom((context) => ({
                target: context.game.currentConflict?.attackingPlayer ?? [],
                amount: context.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0
            }));
    }
}
