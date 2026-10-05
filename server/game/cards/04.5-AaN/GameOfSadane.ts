import AbilityDsl from '../../abilitydsl.js';
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
                cardCondition: card => card.isParticipating()
            })
            .target({
                name: 'duelTarget',
                dependsOn: 'challenger',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.duel((context) => ({
                type: DuelType.Political,
                challenger: context.targets.challenger,
                gameAction: (duel) => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor({ target: duel.winner }),
                    AbilityDsl.actions.dishonor({ target: duel.loser })
                ])
            })));
    }
}


export default GameOfSadane;
