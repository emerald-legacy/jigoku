import AbilityDsl from '../../../abilitydsl.js';
import { TargetModes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import Game from '../../../Game.js';

export default class BackhandedCompliment2 extends DrawCard {
    static id = 'backhanded-compliment-2';

    setupCardAbilities() {
        this.action({
            title: 'Select a player to lose an honor and draw a card',
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices: Object.fromEntries(
                    (this.game as Game)
                        .getPlayers()
                        .map((target) => [
                            target.name,
                            AbilityDsl.actions.multiple([
                                AbilityDsl.actions.loseHonor({ target }),
                                AbilityDsl.actions.draw({ target })
                            ])
                        ])
                )
            },
            effect: 'make {1} lose an honor and draw a card',
            effectArgs: (context) => (context.select === this.owner.name ? this.owner : this.owner.opponent) as any
        });
    }
}
