import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

class DiplomaticHall extends DrawCard {
    static id = 'diplomatic-hall';

    setupCardAbilities() {
        this.action('Select a player to draw a card')
            .condition(context => context.game.isDuringConflict('political'))
            .select('target', {
                targets: true
            }, {
                [this.owner.name]: AbilityDsl.actions.draw({ target: this.owner }),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.draw({ target: this.owner.opponent })
            })
            .effect('have {1} draw a card', context => (context.select === this.owner.name ? this.owner : this.owner.opponent));
    }
}


export default DiplomaticHall;
