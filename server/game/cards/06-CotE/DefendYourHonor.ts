import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, DuelTypes } from '../../Constants.js';

class DefendYourHonor extends DrawCard {
    static id = 'defend-your-honor';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() && context.player.opponent &&
                    event.card.type === CardTypes.Event && event.context.player === context.player.opponent
            },
            initiateDuel: context => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => duel.winner && duel.winningPlayer === context.player && AbilityDsl.actions.cancel()
            })
        });
    }
}


export default DefendYourHonor;
