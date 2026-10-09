import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../Constants.js';
import { cannotApplyLastingEffects, modifyMilitarySkill, suppressEffects } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class GiveNoGround extends DrawCard {
    static id = 'give-no-ground';

    setupCardAbilities() {
        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDefending()
            }, cardLastingEffect((context) => ({
                effect: [
                    modifyMilitarySkill(2),
                    suppressEffects((effect) => !!effect && effect.isSkillModifier() && ((effect.getValue() ?? 0) < 0 || effect.getValue(context.target) < 0)),
                    cannotApplyLastingEffects((effect) => effect && effect.isSkillModifier() && ((effect.getValue() ?? 0) < 0 || effect.getValue(context.target) < 0))
                ]
            })))
            .chatText((context) => msg`give +2${'military'} to ${context.chatTarget()} and prevent its skills from being reduced`);
    }
}


export default GiveNoGround;
