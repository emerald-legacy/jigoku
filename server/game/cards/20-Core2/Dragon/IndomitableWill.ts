import AbilityDsl from '../../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import DrawCard from '../../../DrawCard.js';

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
            effectArgs: (context) => context.player.cardsInPlay.find((card) => card.isParticipating()) as DrawCard,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.conflict?.getCharacters(context.player) ?? [],
                effect: AbilityDsl.effects.doesNotBow()
            }))
        });
    }
}
