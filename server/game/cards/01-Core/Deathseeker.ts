import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Deathseeker extends DrawCard {
    static id = 'deathseeker';

    setupCardAbilities() {
        // TODO: RemoveFateOrDiscard action?
        this.reaction('Remove fate/discard character')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && context.source.isAttacking()
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, innerContext) => (card.getFate() > 0 ? card.allowGameAction('removeFate', innerContext) : card.allowGameAction('discardFromPlay', innerContext))
            })
            .handler((context) => {
                if(!context.target) {
                    return;
                }
                if(context.target.getFate() === 0) {
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                } else {
                    this.game.applyGameAction(context, { removeFate: context.target });
                }
            })
            .effect('{1} {0}', (context) => (context.target?.getFate() ?? 0) > 0 ? 'remove 1 fate from' : 'discard');
    }
}


export default Deathseeker;
