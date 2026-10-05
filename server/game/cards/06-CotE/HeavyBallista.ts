import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HeavyBallista extends DrawCard {
    static id = 'heavy-ballista';

    setupCardAbilities() {
        this.action('Bow or remove 1 fate')
            .cost(AbilityDsl.costs.discardCard({ location: Location.Hand }))
            .condition(context => this.game.isDuringConflict(ConflictType.Military) && context.player.isDefendingPlayer())
            .target({
                name: 'character',
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking() && !card.bowed
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent
            }, {
                'Bow': AbilityDsl.actions.bow(context => ({ target: context.targets.character })),
                'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
            });
    }
}


export default HeavyBallista;
