import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

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
            match: (card: DrawCard) => card.isAttacking(),
            effect: AbilityDsl.effects.modifyBothSkills(-1)
        });
    }
}
