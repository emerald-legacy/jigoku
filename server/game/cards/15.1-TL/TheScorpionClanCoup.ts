import { CardType, Players, Trait } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyBothSkills } from '../../effects.js';

export default class TheScorpionClanCoup extends ProvinceCard {
    static id = 'the-scorpion-clan-coup';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.player.isDefendingPlayer() &&
                context.player.cardsInPlay.some(
                    (card) => card.type === CardType.Character && card.hasTrait(Trait.Imperial)
                ),
            targetController: Players.Opponent,
            match: (card) => card.isAttacking(),
            effect: modifyBothSkills(-1)
        });
    }
}
