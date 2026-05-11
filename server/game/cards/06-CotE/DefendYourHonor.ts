import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, DuelTypes } from '../../Constants';

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
