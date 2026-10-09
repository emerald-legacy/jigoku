import type { AbilityContext } from '../../../AbilityContext.js';
import type { Conflict } from '../../../Conflict.js';
import { CardType, RestrictionType, RestrictionScope } from '../../../Constants.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import { cardCannot, doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class DeployedGarrison extends DrawCard {
    static id = 'deployed-garrison';

    setupCardAbilities() {
        this.persistentEffect({
            effect: cardCannot({
                cannot: RestrictionType.ApplyCovert,
                appliesTo: RestrictionScope.OpponentsCardEffects
            })
        });

        this.reaction('Does not bow at the end of the conflict')
            .when({
                afterConflict: (event, context) =>
                    context.player.isDefendingPlayer() &&
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    this.conflictNearHolding(context, event.conflict)
            })
            .cardLastingEffect({
                effect: doesNotBow()
            })
            .chatText('not bow during the conflict resolution');
    }

    private conflictNearHolding(context: AbilityContext, conflict: Conflict) {
        const attackedProvinces = conflict.getConflictProvinces();
        const nearbyProvinces: ProvinceCard[] = context.player.getProvinces((province) => {
            for(const attackedProvince of attackedProvinces) {
                if(
                    attackedProvince === province ||
                    context.player.areLocationsAdjacent(attackedProvince.location, province.location)
                ) {
                    return true;
                }
            }
            return false;
        });

        for(const province of nearbyProvinces) {
            for(const card of context.player.getDynastyCardsInProvince(province.location)) {
                if(card.isFaceup() && card.type === CardType.Holding) {
                    return true;
                }
            }
        }

        return false;
    }
}
