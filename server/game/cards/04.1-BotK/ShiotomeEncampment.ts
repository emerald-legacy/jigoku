import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class ShiotomeEncampment extends DrawCard {
    static id = 'shiotome-encampment';

    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a Cavalry character',
            condition: context =>
                Object.values(this.game.rings).some(
                    ring =>
                        ring.isConsideredClaimed(context.player) &&
                        // @ts-expect-error string literal 'military' vs ConflictTypes enum - game engine accepts both at runtime
                        ring.isConflictType('military')
                ),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('cavalry'),
                gameAction: ability.actions.ready()
            }
        });
    }
}


export default ShiotomeEncampment;
