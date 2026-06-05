import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import AbilityDsl from '../../../abilitydsl.js';
import { TargetMode } from '../../../Constants.js';

class DiplomaticHall extends DrawCard {
    static id = 'diplomatic-hall';

    setupCardAbilities() {
        this.action({
            condition: context => context.game.isDuringConflict('political'),
            title: 'Select a player to draw a card',
            target: {
                mode: TargetMode.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.draw({ target: this.owner }),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.draw({ target: this.owner.opponent })
                }
            },
            effect: 'have {1} draw a card',
            effectArgs: context => (context.select === this.owner.name ? this.owner : this.owner.opponent) as Player
        });
    }
}


export default DiplomaticHall;
