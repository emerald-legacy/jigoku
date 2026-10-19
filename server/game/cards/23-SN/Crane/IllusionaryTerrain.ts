import DrawCard from '../../../DrawCard.js';
import { CardType, Players, Location, Trait } from '../../../Constants.js';
import { copyProvince, reduceCost } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class IllusionaryTerrain extends DrawCard {
    static id = 'illusionary-terrain';

    override setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_card, player) => {
                    return player.filterCardsInPlay((card) => {
                        return card.hasTrait(Trait.Shugenja);
                    }).length;
                },
                match: (card, source) => card === source
            })
        });

        this.wouldInterrupt('Turn province into copy of a province')
            .when({
                onConflictDeclaredBeforeProvinceReveal: () => true
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: (context) => {
                    if(context.player.hasAffinity(Trait.Air, context)) {
                        return Players.Any;
                    }
                    return context.event.conflict.defendingPlayer === context.player ? Players.Self : Players.Opponent;
                },
                cardCondition: (card, context) => card.isFaceup() &&
                    card !== context.event.conflict.conflictProvince &&
                    !(context.event.conflict.conflictProvince?.location === Location.StrongholdProvince &&
                        card.isProvinceCard() && card.cannotBeStrongholdProvince())
            }, cardLastingEffect((context) => ({
                target: context.event.conflict.conflictProvince ?? [],
                targetLocation: Location.Any,
                effect: context.target ? copyProvince(context.target) : []
            })))
            .chatText('transform the attacked province into a copy of {0}');
    }
}
