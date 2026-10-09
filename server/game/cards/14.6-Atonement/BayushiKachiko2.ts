import { msg } from '../../GameChat.js';
import { canPlayFromOutOfPlay, registerToPlayFromOutOfPlay } from '../../effects.js';
import { CardType, Location, Players, PlayType, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { LimitedPlaysFromOutOfPlay } from '../LimitedPlaysFromOutOfPlay.js';

export default class BayushiKachiko2 extends DrawCard {
    static id = 'bayushi-kachiko-2';

    public setupCardAbilities() {
        const plays = new LimitedPlaysFromOutOfPlay<this>(this, {
            max: 3,
            active: (context) => context.game.isDuringConflict(ConflictType.Political) && context.source.isParticipating(),
            allows: (event, context) =>
                event.originalLocation === Location.ConflictDiscardPile &&
                event.card.owner === context.player.opponent &&
                event.card.type === CardType.Event,
            description: 'plays a card from their opponent\'s conflict discard pile',
            afterPlay: (event, context) => {
                context.game.addMessage(msg`${event.card} is removed from the game due to the ability of ${context.source}`);
                event.card.owner.moveCard(event.card, Location.RemovedFromGame);
            }
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringConflict(ConflictType.Political) &&
                context.source.isParticipating() &&
                plays.available,
            location: Location.PlayArea,
            targetLocation: Location.ConflictDiscardPile,
            targetController: Players.Opponent,
            match: (card, context) =>
                card.type === CardType.Event &&
                card.location === Location.ConflictDiscardPile &&
                card.owner === context?.player.opponent,
            effect: [
                canPlayFromOutOfPlay(
                    (player, card) => player !== card.owner,
                    PlayType.PlayFromHand
                ),
                registerToPlayFromOutOfPlay()
            ]
        });
    }
}
