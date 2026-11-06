import { gainAbility, modifyMilitarySkill } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class Naginata extends DrawCard {
    static id = 'naginata';

    override setupCardAbilities() {
        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && context.source.controller.firstPlayer,
            effect: modifyMilitarySkill(1)
        });

        this.whileAttached({
            effect: gainAbility.reaction('Bow a character', (ability) => ability
                .when({
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        event.card.isParticipating(),
                    onSendHome: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        !event.card.isParticipating()
                })
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.militarySkill < context.source.militarySkill
                }, bow()))
        });
    }
}
