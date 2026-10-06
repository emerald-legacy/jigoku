import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { injure } from '../../GameActions/GameActions.js';

class Deathseeker extends DrawCard {
    static id = 'deathseeker';

    setupCardAbilities() {
        this.reaction('Remove fate/discard character')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && context.source.isAttacking()
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent
            }, injure())
            .effect('{1} {0}', (context) => context.target.getFate() > 0 ? 'remove 1 fate from' : 'discard');
    }
}


export default Deathseeker;
