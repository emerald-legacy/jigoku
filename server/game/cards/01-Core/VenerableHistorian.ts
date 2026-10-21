import DrawCard from '../../DrawCard.js';

class VenerableHistorian extends DrawCard {
    static id = 'venerable-historian';

    override setupCardAbilities() {
        this.action('Honor this character')
            .condition((context) => context.source.isParticipating())
            .ifCondition((context) => !!context.player.opponent && context.player.isMoreHonorable())
            .honor();
    }
}


export default VenerableHistorian;
