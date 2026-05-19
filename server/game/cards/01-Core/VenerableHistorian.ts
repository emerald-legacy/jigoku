import DrawCard from '../../drawcard.js';

class VenerableHistorian extends DrawCard {
    static id = 'venerable-historian';

    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: context => context.source.isParticipating() && context.player.opponent && context.player.isMoreHonorable(),
            gameAction: ability.actions.honor()
        });
    }
}


export default VenerableHistorian;
