import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, DuelType } from '../../Constants.js';

class GameOfSadane extends DrawCard {
    static id = 'game-of-sadane';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel((context: AbilityContext) => ({
                        type: DuelType.Political,
                        challenger: context.targets.challenger as DrawCard,
                        gameAction: (duel) => ability.actions.multiple([
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
