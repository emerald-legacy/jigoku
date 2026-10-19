import { msg } from '../../../GameChat.js';
import { doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';

export default class IndomitableWill extends DrawCard {
    static id = 'indomitable-will';

    override setupCardAbilities() {
        this.reaction('Prevent a character from bowing at the end of the conflict')
            .when({
                afterConflict: (event, context) => this.getAloneWinner(event.conflict)?.controller === context.player
            })
            .cardLastingEffect((context) => ({
                target: this.getAloneWinner(context.event.conflict) ?? [],
                effect: doesNotBow()
            }))
            .chatText((context) => msg`prevent ${this.getAloneWinner(context.event.conflict)} from bowing as a result of the conflict's resolution`)
            .cannotBeMirrored();
    }

    // the only character on the winning side, whoever controls it (RRG Winning a Conflict)
    private getAloneWinner(conflict: Conflict): DrawCard | undefined {
        const winners = conflict.getCharacters(conflict.winner);
        return winners.length === 1 ? winners[0] : undefined;
    }
}
