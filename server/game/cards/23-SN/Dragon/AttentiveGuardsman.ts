import { CardType, RestrictionType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { canOnlyBeDeclaredAsAttackerWithCondition, cardCannot, modifyBothSkills } from '../../../effects.js';

export default class AttentiveGuardsman extends DrawCard {
    static id = 'attentive-guardsman';

    setupCardAbilities() {
        this.persistentEffect({
            effect: canOnlyBeDeclaredAsAttackerWithCondition((props) => {
                const { incomingAttackers } = props;
                return !!incomingAttackers?.some((card) => (card.getType() === CardType.Character && card.isUnique()));
            })
        });

        this.persistentEffect({
            condition: (context) => context.game.currentConflict?.attackingPlayer === context.player &&
                !context.game.currentConflict.attackers.some((card) => card.getType() === CardType.Character && card.isUnique()),
            effect: [
                cardCannot(RestrictionType.MoveToConflict)
            ]
        });

        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: modifyBothSkills(1)
        });
    }
}
