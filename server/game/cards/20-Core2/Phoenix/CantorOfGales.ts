import { ConflictType } from '../../../Constants.js';
import { changePlayerSkillModifier } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class CantorOfGales extends DrawCard {
    static id = 'cantor-of-gales';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.source.isAtHome() &&
                context.player.cardsInPlay.some((card) => card.isParticipating() && card.isHonored),
            effect: changePlayerSkillModifier((_player, context) =>
                context.game.currentConflict?.conflictType === ConflictType.Military
                    ? this.getBaseMilitarySkill()
                    : this.getBasePoliticalSkill())
        });
    }
}
