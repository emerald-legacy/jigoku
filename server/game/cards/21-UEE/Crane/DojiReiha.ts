import { chooseAction, honor, noAction, sendHome, sequential } from '../../../GameActions/GameActions.js';
import { DuelType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiReiha extends DrawCard {
    static id = 'doji-reiha';

    override setupCardAbilities() {
        this.conflictAction('Initiate a duel that honors participants and move loser home')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) => sequential([
                    honor({ target: duel.participants }),
                    chooseAction({
                        player: duel.winnerController,
                        choices: {
                            'Move all duel participants home': sendHome({
                                target: duel.participants
                            }),
                            'Do nothing': noAction()
                        }
                    })
                ]),
                onTie: (duel) => honor({ target: duel.participants })
            }));
    }
}
