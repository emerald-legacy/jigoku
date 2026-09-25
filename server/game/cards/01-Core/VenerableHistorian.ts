import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class VenerableHistorian extends DrawCard {
    static id = 'venerable-historian';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Honor this character')
            .condition(context => !!(context.source.isParticipating() && context.player.opponent && context.player.isMoreHonorable()))
            .gameAction(ability.actions.honor());
    }
}


export default VenerableHistorian;
