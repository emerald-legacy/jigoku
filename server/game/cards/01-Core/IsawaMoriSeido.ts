import { CardTypes, Durations } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class IsawaMoriSeido extends StrongholdCard {
    static id = 'isawa-mori-seido';

    setupCardAbilities() {
        this.action({
            title: 'Bow this stronghold',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.modifyGlory(2)
                })
            },
            effect: 'give +2 glory to {0} until the end of the phase'
        });
    }
}
