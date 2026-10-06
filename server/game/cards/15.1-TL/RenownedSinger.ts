import { CardType, Location, Players, TargetMode } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { assignRoles, moveCard, returnToDeck } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class RenownedSinger extends DrawCard {
    static id = 'renowned-singer';

    public setupCardAbilities() {
        this.action('Pick two cards in your discard pile')
            .condition((context) =>
                context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2 &&
                context.player.opponent !== undefined)
            .targetCards({
                mode: TargetMode.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                controller: Players.Self
            }, assignRoles({
                player: Players.Opponent,
                pick: 'hand',
                activePromptTitle: 'Choose a card to add to your opponent\'s hand',
                roles: {
                    hand: moveCard({ destination: Location.Hand }),
                    bottom: returnToDeck({ location: Location.ConflictDiscardPile, bottom: true, shuffle: false })
                },
                message: (assigned, context) =>
                    msg`${context.player.opponent} chooses ${assigned.hand} to be put into ${context.player}'s hand. ${assigned.bottom} is put on the bottom of ${context.player}'s conflict deck`
            }))
            .effect((context) => msg`have ${context.player.opponent} return one of ${context.targets.target} to ${context.player}'s hand`);
    }
}
