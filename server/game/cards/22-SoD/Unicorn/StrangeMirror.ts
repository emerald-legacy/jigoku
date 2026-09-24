import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, PlayType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class StrangeMirror extends DrawCard {
    static id = 'strange-mirror';

    public setupCardAbilities() {
        this.reaction({
            title: 'Put the event underneath attached character',
            when: {
                onCardPlayed: (event, context) =>
                    !!context.source.parentCharacter &&
                    event.card.type === CardType.Event &&
                    event.player === context.player.opponent &&
                    // the event is only movable once it has finished resolving
                    event.card.location === Location.ConflictDiscardPile
            },
            gameAction: AbilityDsl.actions.placeCardUnderneath((context) => ({
                target: context.event.card,
                destination: context.source.parentCharacter ?? undefined
            })),
            effect: 'put {1} facedown underneath {2}',
            effectArgs: (context) => [context.event.card, context.source.parentCharacter]
        });

        this.action({
            title: 'Play an event from underneath attached character',
            condition: (context) => this.eventsUnderneath(context).length > 0,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.selectCard((context: AbilityContext<this>) => ({
                    activePromptTitle: 'Choose an event to play',
                    cardType: CardType.Event,
                    location: Location.Any,
                    controller: Players.Any,
                    cardCondition: (card) => this.eventsUnderneath(context).includes(card),
                    message: '{0} plays {1} from underneath {2}',
                    messageArgs: (card: BaseCard) => [context.player, card, context.source.parentCharacter],
                    // the selected card becomes this action's target
                    gameAction: AbilityDsl.actions.playCard({
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
                })),
                AbilityDsl.actions.chooseAction((context: AbilityContext<this>) => ({
                    activePromptTitle: 'Choose a cost for Strange Mirror',
                    options: {
                        'Sacrifice Strange Mirror': {
                            action: AbilityDsl.actions.discardFromPlay({ target: context.source }),
                            message: '{0} sacrifices {1}'
                        },
                        'Injure attached character': {
                            action: AbilityDsl.actions.injure({ target: context.source.parentCharacter ?? [] }),
                            message: '{0} injures {2}'
                        }
                    },
                    messageArgs: [context.source, context.source.parentCharacter]
                }))
            ])
        });
    }

    private eventsUnderneath(context: AbilityContext<this>): DrawCard[] {
        const character = context.source.parentCharacter;
        if(!character) {
            return [];
        }
        // placeCardUnderneath moves the card to the host's uuid rather than registering
        // it as a child card, so that is where "underneath" is read from.
        return context.game.allCards.filter(
            (card): card is DrawCard => card.location === character.uuid && card.type === CardType.Event
        );
    }
}
