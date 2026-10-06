import DrawCard from '../../DrawCard.js';
import { gainAbility, modifyMilitarySkill } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';
import { AbilityType, CardType, ConflictType } from '../../Constants.js';

class Daikyu extends DrawCard {
    static id = 'daikyu';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && !!context.source.controller.firstPlayer,
            effect: modifyMilitarySkill(2)
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
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
                    gameAction: bow()
                }
            })
        });
    }
}


export default Daikyu;
