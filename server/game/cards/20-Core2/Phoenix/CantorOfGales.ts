import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CantorOfGales extends DrawCard {
    static id = 'cantor-of-gales';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAtHome() &&
                context.player.cardsInPlay.some((card: DrawCard) => card.isParticipating() && card.isHonored),
            effect: AbilityDsl.effects.changePlayerSkillModifier(2)
        });
    }
}
