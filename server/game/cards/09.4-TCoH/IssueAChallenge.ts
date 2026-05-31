import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations } from '../../Constants.js';

class IssueAChallenge extends DrawCard {
    static id = 'issue-a-challenge';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent more than 1 declared defender',
            when: {
                onConflictDeclared: (event, context) => {
                    const conflict = context.game.currentConflict;
                    if(!conflict) {
                        return false;
                    }
                    return conflict.getNumberOfParticipantsFor(context.player) === 1 &&
                        conflict.getParticipants(
                            (participant: any) => participant.hasTrait('bushi') && participant.controller === context.player
                        ).length === 1 &&
                        context.player === conflict.attackingPlayer;
                }
            },
            effect: 'prevent {1} from declaring more than 1 defender.',
            effectArgs: (context) => context.player.opponent ? [context.player.opponent] : [],
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.restrictNumberOfDefenders(1),
                duration: Durations.UntilEndOfConflict
            }))
        });
    }
}


export default IssueAChallenge;
