import AbilityDsl from '../../../abilitydsl.js';
import { AbilityType, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class Naginata extends DrawCard {
    static id = 'naginata';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true });

        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        context.source.isParticipating('military') &&
                        event.card?.type === CardType.Character &&
                        event.card?.isParticipating(),
                    onSendHome: (event, context) =>
                        context.source.isParticipating('military') &&
                        event.card?.type === CardType.Character &&
                        !event.card?.isParticipating()
                },
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.getMilitarySkill() < context.source.getMilitarySkill(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}
