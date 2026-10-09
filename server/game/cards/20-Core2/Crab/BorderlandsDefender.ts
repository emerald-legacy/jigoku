import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class BorderlandsDefender extends DrawCard {
    static id = 'borderlands-defender';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: [
                cardCannot({
                    cannot: RestrictionType.SendHome,
                    appliesTo: RestrictionScope.OpponentsCardEffects
                }),
                cardCannot({
                    cannot: RestrictionType.Bow,
                    appliesTo: RestrictionScope.OpponentsCardEffects
                })
            ]
        });
    }
}
