import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class HeroicResolve extends DrawCard {
    static id = 'heroic-resolve';

    setupCardAbilities() {
        this.action('Ready attached character')
            .condition(context => context.player.getClaimedRings().length >= 2)
            .gameAction(AbilityDsl.actions.ready(context => ({ target: context.source.parentCharacter ?? [] })));
    }
}


export default HeroicResolve;
