import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class GloriousVictory extends DrawCard {
    static id = 'glorious-victory';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor each character you control',
            when: {
                onBreakProvince: (event, context) => this.game.isDuringConflict('military') && event.conflict.attackingPlayer === context.player
            },
            gameAction: ability.actions.honor(context => ({
                target: context.player.filterCardsInPlay(card => card.getType() === CardTypes.Character)
            }))
        });
    }
}


export default GloriousVictory;
