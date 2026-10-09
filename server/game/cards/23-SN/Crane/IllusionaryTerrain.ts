import DrawCard from '../../../DrawCard.js';
import { CardType, Players, Location } from '../../../Constants.js';
import { copyProvince, reduceCost } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class IllusionaryTerrain extends DrawCard {
    static id = 'illusionary-terrain';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: (_card, player) => {
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
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: (context) => {
                    if(context.player.hasAffinity('air', context)) {
                        return Players.Any;
                    }
                    return context.event.conflict.defendingPlayer === context.player ? Players.Self : Players.Opponent;
                },
                cardCondition: (card, context) => card.isFaceup() &&
                    card !== context.event.conflict.conflictProvince
            }, cardLastingEffect((context) => ({
                target: context.event.conflict.conflictProvince ?? [],
                targetLocation: Location.Any,
                effect: context.target ? copyProvince(context.target) : []
            })))
            .chatText('transform the attacked province into a copy of {0}');
    }
}
