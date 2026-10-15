import DrawCard from '../../DrawCard.js';
import { Stage } from '../../Constants.js';

class SententiousPoet extends DrawCard {
    static id = 'sententious-poet';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onSpendFate: (event, context) =>
                    event.context.player === context.player.opponent &&
                    event.amount > 0 &&
                    event.context.stage === Stage.Cost &&
                    event.context.ability.isCardPlayed() &&
                    context.source.isParticipating(),
                onMoveFate: (event, context) =>
                    event.context?.ability.isCardPlayed() &&
                    event.context?.player === context.player.opponent &&
                    (event.fate ?? 0) > 0 &&
                    context.source.isParticipating() &&
                    event.context?.stage === Stage.Cost &&
                    event.recipient?.type === 'ring'
            })
            .gainFate();
    }
}


export default SententiousPoet;
