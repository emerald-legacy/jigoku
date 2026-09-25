import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, DuelType } from '../../Constants.js';

class GameOfSadane extends DrawCard {
    static id = 'game-of-sadane';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Initiate a political duel')
            .target('challenger', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .target('duelTarget', {
                dependsOn: 'challenger',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, ability.actions.duel((context) => ({
                type: DuelType.Political,
                challenger: context.targets.challenger,
                gameAction: (duel) => ability.actions.multiple([
                    ability.actions.honor({ target: duel.winner }),
                    ability.actions.dishonor({ target: duel.loser })
                ])
            })));
    }
}


export default GameOfSadane;
