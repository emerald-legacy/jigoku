import DrawCard from '../../DrawCard.js';
import { Players, CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyGlory } from '../../effects.js';
import { honor } from '../../GameActions/GameActions.js';

class UtakuRumaru extends DrawCard {
    static id = 'utaku-rumaru';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isHonored && card.type === CardType.Character,
            targetController: Players.Self,
            effect: modifyGlory(1)
        });

        this.persistentEffect({
            match: (card) => card.isDishonored && card.type === CardType.Character,
            targetController: Players.Self,
            effect: modifyGlory(-1)
        });

        this.reaction('Honor a participating character')
            .when({
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            })
            .cost(costs.discardCard({
                location: Location.Hand
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, honor());
    }
}

export default UtakuRumaru;

