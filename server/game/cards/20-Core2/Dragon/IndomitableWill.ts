import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class IndomitableWill extends DrawCard {
    static id = 'indomitable-will';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from bowing at the end of the conflict',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getNumberOfParticipantsFor(context.player) === 1
            },
            cannotBeMirrored: true,
            effect: 'prevent {1} from bowing as a result of the conflict\'s resolution',
            effectArgs: (context) => context.player.cardsInPlay.find((card: any) => card.isParticipating()) as any,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: (context as any).event.conflict.getCharacters(context.player),
                effect: AbilityDsl.effects.doesNotBow()
            }))
        });
    }
}
