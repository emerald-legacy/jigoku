import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Stages } from '../../Constants.js';

class SententiousPoet extends DrawCard {
    static id = 'sententious-poet';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSpendFate: (event, context) =>
                    event.context.player === context.player.opponent &&
                    event.amount > 0 &&
                    event.context.stage === Stages.Cost &&
                    event.context.ability.isCardPlayed() &&
                    context.source.isParticipating(),
                onMoveFate: (event, context) =>
                    event.context.ability.isCardPlayed() &&
                    event.context.player === context.player.opponent &&
                    event.fate > 0 &&
                    context.source.isParticipating() &&
                    event.context.stage === Stages.Cost &&
                    event.recipient?.type === 'ring'
            },
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}


export default SententiousPoet;
