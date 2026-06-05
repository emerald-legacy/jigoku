import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType } from '../../Constants.js';

class Daikyu extends DrawCard {
    static id = 'daikyu';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context: AbilityContext<this>) => !!context.source.parent && !!context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onConflictDeclared: (_event, context) =>
                        (context.source as DrawCard).isParticipating() && context.game.isDuringConflict('military'),
                    onDefendersDeclared: (_event, context) =>
                        (context.source as DrawCard).isParticipating() && context.game.isDuringConflict('military'),
                    onMoveToConflict: (_event, context) =>
                        (context.source as DrawCard).isParticipating() && context.game.isDuringConflict('military')
                },
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card: DrawCard, context: AbilityContext) =>
                        card.getMilitarySkill() < (context.source as DrawCard).getMilitarySkill() && card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}


export default Daikyu;
