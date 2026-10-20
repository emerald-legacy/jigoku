import DrawCard from '../../DrawCard.js';
import { gainAbility, modifyMilitarySkill } from '../../effects.js';
import { bow } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class Daikyu extends DrawCard {
    static id = 'daikyu';

    override setupCardAbilities() {
        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && !!context.source.controller.firstPlayer,
            effect: modifyMilitarySkill(2)
        });

        this.whileAttached({
            effect: gainAbility.reaction('Bow a character', (ability) => ability
                .when({
                    onConflictDeclared: (_event, context) =>
                        context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military),
                    onDefendersDeclared: (event, context) =>
                        event.defenders.length > 0 && context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military),
                    onMoveToConflict: (_event, context) =>
                        context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Military)
                })
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.militarySkill < context.source.militarySkill && card.isParticipating()
                }, bow()))
        });
    }
}


export default Daikyu;
