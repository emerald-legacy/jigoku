import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes } from '../../Constants.js';

class Daikyu extends DrawCard {
    static id = 'daikyu';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context: AbilityContext<this>) => !!context.source.parent && !!context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Bow a character',
                when: {
                    onConflictDeclared: (_event: any, context: AbilityContext) =>
                        context.source.isParticipating() && context.game.isDuringConflict('military'),
                    onDefendersDeclared: (_event: any, context: AbilityContext) =>
                        context.source.isParticipating() && context.game.isDuringConflict('military'),
                    onMoveToConflict: (_event: any, context: AbilityContext) =>
                        context.source.isParticipating() && context.game.isDuringConflict('military')
                },
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card: BaseCard, context: AbilityContext) =>
                        card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}


export default Daikyu;
