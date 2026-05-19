import DrawCard from '../../drawcard.js';

class HeroicResolve extends DrawCard {
    static id = 'heroic-resolve';

    setupCardAbilities(ability) {
        this.action({
            title: 'Ready attached character',
            condition: context => context.player.getClaimedRings().length >= 2,
            gameAction: ability.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}


export default HeroicResolve;
