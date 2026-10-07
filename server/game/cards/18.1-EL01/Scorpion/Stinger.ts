import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { cardCannot } from '../../../effects.js';
import { attach } from '../../../GameActions/GameActions.js';
import { Location, Players, CardType, Phases, ConflictType } from '../../../Constants.js';

class Stinger extends DrawCard {
    static id = 'stinger';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.game.currentPhase !== Phases.Fate,
            effect: cardCannot({
                cannot: 'ready',
                source: this
            })
        });

        this.conflictAction('Attach this to an attacking character', { conflictType: ConflictType.Military })
            .cost(costs.payHonor(1))
            .target({
                player: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking()
            }, attach((context) => ({
                attachment: context.source
            })))
            .location(Location.Hand);
    }
}

export default Stinger;
