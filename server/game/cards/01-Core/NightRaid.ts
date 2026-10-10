import { ProvinceCard } from '../../ProvinceCard.js';

export default class NightRaid extends ProvinceCard {
    static id = 'night-raid';

    setupCardAbilities() {
        this.reaction('Force opponent to discard cards equal to the number of attackers')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .chosenDiscard((context) => ({
                amount: context.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0
            }));
    }
}
