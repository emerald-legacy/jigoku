import DrawCard from '../../DrawCard.js';
import { CardTypes, ConflictTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class GiveNoGround extends DrawCard {
    static id = 'give-no-ground';

    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(ConflictTypes.Military),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isDefending(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(2),
                        AbilityDsl.effects.suppressEffects((effect: any) => effect && effect.isSkillModifier() && (effect.getValue() < 0 || effect.getValue(context.target) < 0)),
                        AbilityDsl.effects.cannotApplyLastingEffects((effect: any) => effect && effect.isSkillModifier() && (effect.getValue() < 0 || effect.getValue(context.target) < 0))
                    ]
                }))
            },
            effect: 'give +2{1} to {0} and prevent its skills from being reduced',
            effectArgs: ['military']
        });
    }
}


export default GiveNoGround;
