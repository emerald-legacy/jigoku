import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { revealedTopCardPlayable } from '../revealedTopCardPlayable.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    override setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .condition((context) => context.player.conflictDeck.length > 0)
            .phase(Phase.Conflict)
            .playerLastingEffect((context) => revealedTopCardPlayable(context.player, this, 'phase'))
            .chatText('reveal the top card of their conflict deck');
    }
}


export default ArtisanAcademy;
