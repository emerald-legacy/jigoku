import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GiveNoGround extends DrawCard {
    static id = 'give-no-ground';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isDefending()
            }, AbilityDsl.actions.cardLastingEffect(context => ({
                effect: [
                    AbilityDsl.effects.modifyMilitarySkill(2),
                    AbilityDsl.effects.suppressEffects((effect) => !!effect && effect.isSkillModifier() && ((effect.getValue() ?? 0) < 0 || effect.getValue(context.target) < 0)),
                    AbilityDsl.effects.cannotApplyLastingEffects((effect) => effect && effect.isSkillModifier() && ((effect.getValue() ?? 0) < 0 || effect.getValue(context.target) < 0))
                ]
            })))
            .effect('give +2{1} to {0} and prevent its skills from being reduced', () => (['military']));
    }
}


export default GiveNoGround;
