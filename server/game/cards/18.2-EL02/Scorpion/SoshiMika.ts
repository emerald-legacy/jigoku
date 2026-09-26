import DrawCard from '../../../DrawCard.js';
import { Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class SoshiMika extends DrawCard {
    static id = 'soshi-mika';

    setupCardAbilities() {
        this.forcedReaction('After the conflict phase begins')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor(context => ({
                    target: context.game.getPlayers()
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ]))
            .effect('have each player lose an honor and draw two cards');

        this.action('Flip the Imperial Favor')
            .gameAction(AbilityDsl.actions.flipImperialFavor(context => ({
                target: context.player.imperialFavor ? context.player : context.player.opponent
            })));
    }
}


export default SoshiMika;
