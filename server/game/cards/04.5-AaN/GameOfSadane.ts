import DrawCard from '../../drawcard.js';
import { Players, CardTypes, DuelTypes } from '../../Constants.js';

class GameOfSadane extends DrawCard {
    static id = 'game-of-sadane';

    setupCardAbilities(ability: any) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel((context: any) => ({
                        type: DuelTypes.Political,
                        challenger: context.targets.challenger,
                        gameAction: (duel: any) => ability.actions.multiple([
                            ability.actions.honor({ target: duel.winner }),
                            ability.actions.dishonor({ target: duel.loser })
                        ])
                    }))
                }
            }
        });
    }
}


export default GameOfSadane;
