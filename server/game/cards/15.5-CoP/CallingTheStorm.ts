import DrawCard from '../../DrawCard.js';
import { Location, Players, PlayType, Duration } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { canPlayFromOutOfPlay, showTopConflictCard } from '../../effects.js';

class CallingTheStorm extends DrawCard {
    static id = 'calling-the-storm';

    override setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .cost(costs.discardHand())
            .cardLastingEffect((context) => ({
                target: context.player.getAllConflictCards(), //since this applies in one shot, apply it to all conflict cards
                targetLocation: Location.Any,
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Self,
                canChangeZoneNTimes: 9999999, // can change zones infinite times and still be playable if it ends up in the deck
                effect: canPlayFromOutOfPlay((player, card) => {
                    return context.player.conflictDeck.length > 0 && card === player.conflictDeck[0] &&
                            player === card.owner && card.location === Location.ConflictDeck;
                }, PlayType.PlayFromHand)
            }))
            .playerLastingEffect(() => ({
                duration: Duration.UntilEndOfPhase,
                effect: showTopConflictCard(Players.Self)
            }))
            .chatText('play cards from their conflict deck this phase');
    }
}


export default CallingTheStorm;
