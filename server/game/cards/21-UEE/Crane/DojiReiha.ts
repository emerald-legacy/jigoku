import { chooseAction, honor, noAction, sendHome, sequential } from '../../../GameActions/GameActions.js';
import { DuelType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiReiha extends DrawCard {
    static id = 'doji-reiha';

    setupCardAbilities() {
        this.conflictAction('Initiate a duel that honors participants and move loser home')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) =>
                    sequential([
                        honor({ target: duel.participants }),
                        chooseAction((context) => ({
                            player: duel.winningPlayer === context.player ? Players.Self : Players.Opponent,
                            choices: {
                                'Move all duel participants home': sendHome({
                                    target: duel.participants
                                }),
                                'Do nothing': noAction()
                            }
                        }))
                    ])
            }));
    }
}
