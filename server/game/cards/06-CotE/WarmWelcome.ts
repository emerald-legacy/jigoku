import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType, PlayType} from '../../Constants.js';
import { moveCard, playCard, sequential } from '../../GameActions/GameActions.js';

class WarmWelcome extends DrawCard {
    static id = 'warm-welcome';

    override setupCardAbilities() {
        this.action('Play a conflict card from discard')
            .playOnlyIf((context) => !!(context.player.opponent && context.player.showBid < context.player.opponent.showBid))
            .target({
                location: Location.ConflictDiscardPile,
                controller: Players.Self
            }, sequential([
                playCard((context) => ({
                    source: this,
                    target: context.target,
                    playType: PlayType.PlayFromHand
                })),
                moveCard((context) => ({
                    target: context.target.type === CardType.Event ? context.target : [],
                    destination: Location.ConflictDeck, bottom: true
                }))
            ]));
    }
}


export default WarmWelcome;
