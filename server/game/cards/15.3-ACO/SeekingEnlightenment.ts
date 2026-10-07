import { ProvinceCard } from '../../ProvinceCard.js';

export default class SeekingEnlightenment extends ProvinceCard {
    static id = 'seeking-enlightenment';

    setupCardAbilities() {
        this.reaction('Force opponent to lose fate equal to the number of attackers')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .loseFate((context) => ({
                target: context.player.opponent,
                amount: context.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0
            }));
    }
}
