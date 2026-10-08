import { msg } from '../../../GameChat.js';
import { doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class IndomitableWill extends DrawCard {
    static id = 'indomitable-will';

    setupCardAbilities() {
        this.reaction('Prevent a character from bowing at the end of the conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getNumberOfParticipantsFor(context.player) === 1
            })
            .cardLastingEffect((context) => ({
                target: context.event.conflict.getCharacters(context.player),
                effect: doesNotBow()
            }))
            .chatText((context) => msg`prevent ${context.player.cardsInPlay.find((card) => card.isParticipating())} from bowing as a result of the conflict's resolution`)
            .cannotBeMirrored();
    }
}
