import { Trait } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { restrictNumberOfDefenders } from '../../effects.js';
import { attacksAloneWithTrait } from '../attacksAlone.js';

class IssueAChallenge extends DrawCard {
    static id = 'issue-a-challenge';

    override setupCardAbilities() {
        this.reaction('Prevent more than 1 declared defender')
            .when({
                onConflictDeclared: (event, context) => attacksAloneWithTrait(event.conflict, context.player, Trait.Bushi)
            })
            .playerLastingEffect({
                effect: restrictNumberOfDefenders(1)
            })
            .chatText((context) => msg`prevent ${context.player.opponent} from declaring more than 1 defender`);
    }
}


export default IssueAChallenge;
