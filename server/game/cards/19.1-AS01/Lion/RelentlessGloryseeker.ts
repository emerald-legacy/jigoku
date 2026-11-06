import { msg } from '../../../GameChat.js';
import { Duration, Location, Phase } from '../../../Constants.js';
import { removeFromGameInsteadOfLeavingPlay } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class RelentlessGloryseeker extends DrawCard {
    static id = 'relentless-gloryseeker';

    public override setupCardAbilities() {
        this.reaction('Put this character into play')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === Phase.Conflict
            })
            .location(Location.DynastyDiscardPile)
            .putIntoPlay()
            .chatText('return to play - {0} is ready for more')
            .afterwardsIf((context) => context.source.location === Location.PlayArea)
            .cardLastingEffect((context) => ({
                target: context.source,
                duration: Duration.UntilEndOfRound,
                effect: removeFromGameInsteadOfLeavingPlay({
                    message: (card) => msg`${card} is removed from the game due to leaving play - may their tales lead them to Yomi`
                })
            }));
    }
}
