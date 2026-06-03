import AbilityDsl from '../../../abilitydsl.js';
import { DuelType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DojiReiha extends DrawCard {
    static id = 'doji-reiha';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a duel that honors participants and move loser home',
            initiateDuel: {
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) =>
                    AbilityDsl.actions.sequential([
                        AbilityDsl.actions.honor({ target: duel.participants }),
                        AbilityDsl.actions.chooseAction((context) => ({
                            player: duel.winningPlayer === context.player ? Players.Self : Players.Opponent,
                            options: {
                                'Move all duel participants home': {
                                    action: AbilityDsl.actions.sendHome({
                                        target: duel.participants
                                    })
                                },
                                'Do nothing': {
                                    action: AbilityDsl.actions.noAction()
                                }
                            }
                        }))
                    ])
            }
        });
    }
}
