import { dishonor, duel, honor, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, DuelType } from '../../Constants.js';

class GameOfSadane extends DrawCard {
    static id = 'game-of-sadane';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .target({
                name: 'challenger',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            })
            .target({
                name: 'duelTarget',
                dependsOn: 'challenger',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, duel((context) => ({
                type: DuelType.Political,
                challenger: context.targets.challenger,
                gameAction: (duel) => multiple([
                    honor({ target: duel.winner }),
                    dishonor({ target: duel.loser })
                ])
            })));
    }
}


export default GameOfSadane;
