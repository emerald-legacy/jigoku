import DrawCard from '../../DrawCard.js';
import { CardTypes, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoStables extends DrawCard {
    static id = 'moto-stables';

    setupCardAbilities() {
        this.reaction({
            title: 'Give +2 military',
            limit: AbilityDsl.limit.perRound(2),
            when: {
                onMoveToConflict: (event, context) =>
                    event.card.type === CardTypes.Character &&
                    event.card.isParticipating() &&
                    event.card.controller === context.player
            },
            effect: 'give {1} +2{2}',
            effectArgs: (context) => [context.event.card, 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Durations.UntilEndOfConflict,
                target: context.event.card,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
        });
    }
}


export default MotoStables;
