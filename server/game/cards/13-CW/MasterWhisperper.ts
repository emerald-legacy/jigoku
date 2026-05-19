import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes } from '../../Constants.js';

class MasterWhisperer extends DrawCard {
    static id = 'master-whisperer';

    setupCardAbilities() {
        this.action({
            title: 'Select a player to discard 3 cards and draw 3 cards',
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.chosenDiscard({ targets: false, target: this.owner, amount: 3 }),
                        AbilityDsl.actions.draw({ target: this.owner, amount: 3 })
                    ]),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.chosenDiscard({ targets: false, target: this.owner.opponent, amount: 3 }),
                        AbilityDsl.actions.draw({ target: this.owner.opponent, amount: 3 })
                    ])
                }
            },
            effect: 'make {1}{2} draw 3 cards',
            effectArgs: context => {
                let player = context.select === this.owner.name ? this.owner : this.owner.opponent;
                let handSize = player.hand.length;
                let amountDiscarded = Math.min(3, handSize);
                return [player, amountDiscarded > 0 ? ' discard ' + amountDiscarded + ' cards and' : ''];
            }
        });
    }
}


export default MasterWhisperer;
