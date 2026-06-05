import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type StaticEffect from '../../Effects/StaticEffect.js';

class GiveNoGround extends DrawCard {
    static id = 'give-no-ground';

    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(ConflictType.Military),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isDefending(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(2),
                        AbilityDsl.effects.suppressEffects((effect: unknown) => !!effect && (effect as StaticEffect).isSkillModifier() && ((effect as StaticEffect).getValue<number>() < 0 || (effect as StaticEffect).getValue<number>(context.target) < 0)),
                        AbilityDsl.effects.cannotApplyLastingEffects((effect: StaticEffect) => effect && effect.isSkillModifier() && (effect.getValue<number>() < 0 || effect.getValue<number>(context.target) < 0))
                    ]
                }))
            },
            effect: 'give +2{1} to {0} and prevent its skills from being reduced',
            effectArgs: ['military']
        });
    }
}


export default GiveNoGround;
