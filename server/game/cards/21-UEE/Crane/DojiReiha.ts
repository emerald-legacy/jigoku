import { chooseAction, honor, noAction, sendHome, sequential } from '../../../GameActions/GameActions.js';
import { DuelType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

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
                            'Move all duel participants home': {
                                action: sendHome({
                                    target: duel.participants
                                }),
                                message: (_context, _target, chooser) =>
                                    msg`${chooser} chooses to move ${duel.participants.filter((card) => card.isParticipating())} home`
                            },
                            'Do nothing': {
                                action: noAction(),
                                message: (_context, _target, chooser) => msg`${chooser} chooses not to move the contestants home`
                            }
                        }
                    })
                ]),
                onTie: (duel) => honor({ target: duel.participants })
            }));
    }
}
