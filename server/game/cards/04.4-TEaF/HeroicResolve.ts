import DrawCard from '../../DrawCard.js';

class HeroicResolve extends DrawCard {
    static id = 'heroic-resolve';

    override setupCardAbilities() {
        this.action('Ready attached character')
            .condition((context) => context.player.getClaimedRings().length >= 2)
            .ready((context) => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default HeroicResolve;
