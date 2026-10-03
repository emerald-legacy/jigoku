import DrawCard from '../../DrawCard.js';
import { CardType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoStables extends DrawCard {
    static id = 'moto-stables';

    setupCardAbilities() {
        this.reaction('Give +2 military')
            .when({
                onMoveToConflict: (event, context) =>
                    event.card.type === CardType.Character &&
                    event.card.isParticipating() &&
                    event.card.controller === context.player
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfConflict,
                target: context.event.card,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            })))
            .effect('give {1} +2{2}', (context) => [context.event.card ?? '', 'military'])
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MotoStables;
