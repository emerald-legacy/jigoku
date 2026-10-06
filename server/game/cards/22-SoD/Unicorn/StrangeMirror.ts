import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import {
    chooseAction,
    injure,
    placeCardUnderneath,
    playCard,
    sacrifice,
    selectCard,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class StrangeMirror extends DrawCard {
    static id = 'strange-mirror';

    public setupCardAbilities() {
        this.reaction('Put the event underneath attached character')
            .when({
                onCardPlayed: (event, context) =>
                    !!context.source.parentCharacter &&
                    event.card.type === CardType.Event &&
                    event.player === context.player.opponent &&
                    // the event is only movable once it has finished resolving
                    event.card.location === Location.ConflictDiscardPile
            })
            .gameAction(placeCardUnderneath((context) => ({
                target: context.event.card,
                destination: context.source.parentCharacter ?? undefined
            })))
            .effect((context) => msg`put ${context.event.card} facedown underneath ${context.source.parentCharacter}`);

        const chooseEvent = selectCard((context: AbilityContext<this>) => ({
            activePromptTitle: 'Choose an event to play',
            cardType: CardType.Event,
            location: Location.Any,
            controller: Players.Any,
            cardCondition: (card) => card.isDrawCard() && this.eventsUnderneath(context).includes(card),
            message: '{0} plays {1} from underneath {2}',
            messageArgs: (card) => [context.player, card, context.source.parentCharacter],
            // the selected card becomes this action's target
            gameAction: playCard({
                source: this,
                playType: PlayType.PlayFromHand,
                // the event sits underneath a card, which is not a playable location
                ignoredRequirements: ['location'],
                destination: Location.ConflictDiscardPile,
                // a played event returns to its owner's discard pile, not the pile of
                // whoever played it out from underneath
                postHandler: (playedContext) =>
                    playedContext.source.owner.moveCard(
                        playedContext.source,
                        Location.ConflictDiscardPile
                    )
            })
        }));

        // only while an event underneath can be played: otherwise the cost would be paid for nothing
        this.action('Play an event from underneath attached character')
            .condition((context) => chooseEvent.hasLegalTarget(context))
            .gameAction(sequential([
                chooseEvent,
                chooseAction((context) => ({
                    activePromptTitle: 'Choose a cost for Strange Mirror',
                    options: {
                        'Sacrifice Strange Mirror': {
                            action: sacrifice({ target: context.source }),
                            message: '{0} sacrifices {2}'
                        },
                        'Injure attached character': {
                            action: injure({ target: context.source.parentCharacter ?? [] }),
                            message: '{0} injures {3}'
                        }
                    },
                    messageArgs: [context.source, context.source.parentCharacter]
                }))
            ]))
            .effect((context) => msg`play an event from underneath ${context.source.parentCharacter}`);
    }

    private eventsUnderneath(context: AbilityContext<this>): DrawCard[] {
        const character = context.source.parentCharacter;
        if(!character) {
            return [];
        }
        // placeCardUnderneath moves the card to the host's uuid rather than registering
        // it as a child card, so that is where "underneath" is read from.
        return context.game.allCards.filter(
            (card): card is DrawCard => card.isDrawCard() && card.location === character.uuid && card.type === CardType.Event
        );
    }
}
