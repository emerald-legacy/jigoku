import { gainAbility, modifyMilitarySkill } from '../../../effects.js';
import { bow } from '../../../GameActions/GameActions.js';
import { AbilityType, CardType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class Naginata extends DrawCard {
    static id = 'naginata';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && context.source.controller.firstPlayer,
            effect: modifyMilitarySkill(1)
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        event.card.isParticipating(),
                    onSendHome: (event, context) =>
                        context.source.isParticipating(ConflictType.Military) &&
                        event.card.type === CardType.Character &&
                        !event.card.isParticipating()
                },
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.militarySkill < context.source.militarySkill,
                    gameAction: bow()
                }
            })
        });
    }
}
