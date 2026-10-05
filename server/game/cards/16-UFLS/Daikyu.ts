import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, CardType, ConflictType } from '../../Constants.js';

class Daikyu extends DrawCard {
    static id = 'daikyu';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && !!context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onConflictDeclared: (_event, context) =>
                        context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military),
                    onDefendersDeclared: (_event, context) =>
                        context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military),
                    onMoveToConflict: (_event, context) =>
                        context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military)
                },
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}


export default Daikyu;
