import DrawCard from '../../../DrawCard.js';
import { CardType, Players, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class IllusionaryTerrain extends DrawCard {
    static id = 'illusionary-terrain';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.filterCardsInPlay((card) => {
                        return card.hasTrait('shugenja');
                    }).length;
                },
                match: (card, source) => card === source
            })
        });

        this.wouldInterrupt('Turn province into copy of a province')
            .when({
                onConflictDeclaredBeforeProvinceReveal: () => true
            })
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: (context) => {
                    if(context.player.hasAffinity('air', context)) {
                        return Players.Any;
                    }
                    const conflict = context.event.conflict;
                    return conflict?.defendingPlayer === context.player ? Players.Self : Players.Opponent;
                },
                cardCondition: (card, context) => card.isFaceup() &&
                    card !== context.event.conflict?.conflictProvince
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.event.conflict?.conflictProvince ?? [],
                targetLocation: Location.Any,
                effect: context.target ? AbilityDsl.effects.copyProvince(context.target) : []
            })))
            .effect('transform the attacked province into a copy of {0}');
    }
}
