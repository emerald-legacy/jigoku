import { CardTypes, Durations, Phases, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class HouseOfLeaves extends StrongholdCard {
    static id = 'house-of-leaves';

    setupCardAbilities() {
        this.action({
            title: 'Bow this stronghold',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => !card.isParticipating(),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.modifyGlory(2)
                })
            },
            effect: 'give +2 glory to {0} for this phase'
        });
    }
}
