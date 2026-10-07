import DrawCard from '../../DrawCard.js';
import { restrictNumberOfDefenders } from '../../effects.js';

class IssueAChallenge extends DrawCard {
    static id = 'issue-a-challenge';

    setupCardAbilities() {
        this.reaction('Prevent more than 1 declared defender')
            .when({
                onConflictDeclared: (_event, context) => {
                    const conflict = context.game.currentConflict;
                    if(!conflict) {
                        return false;
                    }
                    return conflict.getNumberOfParticipantsFor(context.player) === 1 &&
                        conflict.getParticipants(
                            (participant) => participant.hasTrait('bushi') && participant.controller === context.player
                        ).length === 1 &&
                        context.player === conflict.attackingPlayer;
                }
            })
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: restrictNumberOfDefenders(1)
            }))
            .effect('prevent {1} from declaring more than 1 defender', (context) => context.player.opponent ? [context.player.opponent] : []);
    }
}


export default IssueAChallenge;
