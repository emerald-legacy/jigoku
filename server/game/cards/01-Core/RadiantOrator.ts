import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { hasMoreParticipatingGlory } from '../participatingGlory.js';

class RadiantOrator extends DrawCard {
    static id = 'radiant-orator';

    setupCardAbilities() {
        this.action('Send a character home')
            .condition(context => context.source.isParticipating() && hasMoreParticipatingGlory(context.player))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent
            }, AbilityDsl.actions.sendHome());
    }
}


export default RadiantOrator;
