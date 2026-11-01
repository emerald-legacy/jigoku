import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { restrictNumberOfDefenders } from '../../effects.js';

class IssueAChallenge extends DrawCard {
    static id = 'issue-a-challenge';

    override setupCardAbilities() {
        this.reaction('Prevent more than 1 declared defender')
            .when({
                onConflictDeclared: (_event, context) => {
                    const conflict = context.game.currentConflict;
                    if(!conflict) {
                        return false;
                    }
                    return conflict.getNumberOfParticipantsFor(context.player) === 1 &&
                        conflict.getParticipants(
                            (participant) => participant.hasTrait(Trait.Bushi) && participant.controller === context.player
                        ).length === 1 &&
                        context.player === conflict.attackingPlayer;
                }
            })
            .playerLastingEffect({
                effect: restrictNumberOfDefenders(1)
            })
            .chatText((context) => msg`prevent ${context.player.opponent} from declaring more than 1 defender`);
    }
}


export default IssueAChallenge;
