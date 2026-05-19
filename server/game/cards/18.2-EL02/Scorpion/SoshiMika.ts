import DrawCard from '../../../drawcard.js';
import { Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class SoshiMika extends DrawCard {
    static id = 'soshi-mika';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'have each player lose an honor and draw two cards',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor(context => ({
                    target: context.game.getPlayers()
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ])
        });

        this.action({
            title: 'Flip the Imperial Favor',
            gameAction: AbilityDsl.actions.flipImperialFavor(context => ({
                target: context.player.imperialFavor ? context.player : context.player.opponent
            }))
        });
    }
}


export default SoshiMika;
