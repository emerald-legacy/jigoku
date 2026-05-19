import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class MakeYourCase extends DrawCard {
    static id = 'make-your-case';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesDuelTarget: true,
                message: '{0}{1}',
                messageArgs: duel => [
                    duel.winner,
                    duel.winner ? ' gains a fate' : ''
                ],
                gameAction: duel => AbilityDsl.actions.placeFate({
                    target: duel.winner,
                    amount: 1
                })
            }
        });
    }
}


export default MakeYourCase;
