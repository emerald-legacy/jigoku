import DrawCard from '../../DrawCard.js';
import { TargetMode, CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HeavyBallista extends DrawCard {
    static id = 'heavy-ballista';

    setupCardAbilities() {
        this.action({
            title: 'Bow or remove 1 fate',
            condition: context => this.game.isDuringConflict('military') && context.player.isDefendingPlayer(),
            cost: AbilityDsl.costs.discardCard({ location: Location.Hand }),
            targets: {
                character: {
                    cardType: CardType.Character,
                    cardCondition: card => card.isAttacking() && !card.bowed
                },
                select: {
                    mode: TargetMode.Select,
                    dependsOn: 'character',
                    player: context => (context.targets.character as DrawCard).controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Bow': AbilityDsl.actions.bow(context => ({ target: context.targets.character })),
                        'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default HeavyBallista;
