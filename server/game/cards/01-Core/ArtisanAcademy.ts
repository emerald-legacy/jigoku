import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { revealedTopCardPlayable } from '../revealedTopCardPlayable.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .condition((context) => context.player.conflictDeck.length > 0)
            .playerLastingEffect((context) => revealedTopCardPlayable(context.player, this, 'phase'))
            .chatText('reveal the top card of their conflict deck')
            .phase(Phase.Conflict);
    }
}


export default ArtisanAcademy;
