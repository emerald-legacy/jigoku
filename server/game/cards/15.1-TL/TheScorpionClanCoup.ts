import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyBothSkills } from '../../effects.js';

export default class TheScorpionClanCoup extends ProvinceCard {
    static id = 'the-scorpion-clan-coup';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.player.isDefendingPlayer() &&
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardType.Character && card.hasTrait('imperial')
                ),
            targetController: Players.Opponent,
            match: (card) => card.isAttacking(),
            effect: modifyBothSkills(-1)
        });
    }
}
