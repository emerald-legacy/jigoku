import DrawCard from '../../DrawCard.js';
import { revealedTopCardPlayable } from '../revealedTopCardPlayable.js';

class PillowBook extends DrawCard {
    static id = 'pillow-book';

    override setupCardAbilities() {
        this.action('Make top card of your conflict deck playable')
            .condition((context) => !!context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.player.conflictDeck.length > 0)
            .playerLastingEffect((context) => revealedTopCardPlayable(context.player, this, 'conflict'))
            .chatText('make the top card of their deck playable until the end of the conflict');
    }
}


export default PillowBook;
