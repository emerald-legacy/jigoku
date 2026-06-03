import DrawCard from '../../DrawCard.js';
import { Location, Players, PlayType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CallingTheStorm extends DrawCard {
    static id = 'calling-the-storm';

    setupCardAbilities() {
        this.action({
            title: 'Make top card of conflict deck playable',
            cost: AbilityDsl.costs.discardHand(),
            effect: 'play cards from their conflict deck this phase',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.player.getAllConflictCards(), //since this applies in one shot, apply it to all conflict cards
                    targetLocation: Location.Any,
                    duration: Duration.UntilEndOfPhase,
                    targetController: Players.Self,
                    canChangeZoneNTimes: 9999999, // can change zones infinite times and still be playable if it ends up in the deck
                    effect: AbilityDsl.effects.canPlayFromOutOfPlay((player: any, card: any) => {
                        return player && player.conflictDeck &&
                            context.player.conflictDeck.length > 0 && card === player.conflictDeck[0] &&
                            player === card.owner && card.location === Location.ConflictDeck;
                    }, PlayType.PlayFromHand)
                })),
                AbilityDsl.actions.playerLastingEffect(() => ({
                    targetController: Players.Self,
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.showTopConflictCard(Players.Self)
                }))
            ])
        });
    }
}


export default CallingTheStorm;
