import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { EventName, Location, Players, PlayType } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import DrawCard from '../../DrawCard.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type Player from '../../Player.js';

const MAXIMUM_CARDS_ALLOWED = 3;

type CardPlayedEvent = EventPayload<EventName.OnCardPlayed> & {
    onPlayCardSource?: unknown;
    originallyOnTopOfConflictDeck?: boolean;
    sourceOfCardPlayedFromConflictDeck?: BaseCard;
};

export default class MasterTactician extends DrawCard {
    static id = 'master-tactician';
    private eventRegistrar?: EventRegistrar;

    private cardsPlayedThisRound = 0;
    private mostRecentEvent?: CardPlayedEvent;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnRoundEnded, EventName.OnCharacterEntersPlay]);

        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCardPlayed: (event: CardPlayedEvent, context: AbilityContext) => {
                        if(this.cardsPlayedThisRound >= MAXIMUM_CARDS_ALLOWED) {
                            return false;
                        }
                        this.mostRecentEvent = event;
                        return (
                            event.originalLocation === Location.ConflictDeck &&
                            !event.onPlayCardSource &&
                            !event.card.fromOutOfPlaySource &&
                            event.originallyOnTopOfConflictDeck &&
                            event.player === context.player &&
                            !event.sourceOfCardPlayedFromConflictDeck &&
                            (context.source as DrawCard).isParticipating() &&
                            context.game.isTraitInPlay('battlefield')
                        );
                    }
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        if(!this.mostRecentEvent) {
                            return;
                        }
                        if(
                            this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck &&
                            this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck !== this
                        ) {
                            return;
                        }
                        if(!this.cardsPlayedThisRound || this.cardsPlayedThisRound < 0) {
                            this.cardsPlayedThisRound = 0;
                        }
                        this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck = this;
                        this.cardsPlayedThisRound++;
                        this.game.addMessage(
                            '{0} plays a card from their conflict deck due to the ability of {1} ({2} use{3} remaining)',
                            context.player,
                            context.source,
                            MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound,
                            MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound === 1 ? '' : 's'
                        );
                    }
                })
            })
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.isTraitInPlay('battlefield') &&
                context.source.isParticipating() &&
                this.cardsPlayedThisRound < MAXIMUM_CARDS_ALLOWED,
            targetLocation: Location.ConflictDeck,
            targetController: Players.Self,
            match: (card, context) =>
                !!(context && context.player.conflictDeck.length > 0 && card === context.player.conflictDeck[0]),
            effect: AbilityDsl.effects.canPlayFromOutOfPlay(
                (player: Player, card: BaseCard) => player === card.owner,
                PlayType.PlayFromHand
            )
        });

        this.persistentEffect({
            condition: (context) => {
                const defending = context.game.currentConflict && context.player.isDefendingPlayer();
                const preventShowing = defending && !context.game.currentConflict?.defendersChosen;
                return context.game.isTraitInPlay('battlefield') && context.source.isParticipating() && !preventShowing;
            },
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopConflictCard(Players.Self)
        });
    }

    public onRoundEnded() {
        this.cardsPlayedThisRound = 0;
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        if(event.card === this) {
            this.cardsPlayedThisRound = 0;
        }
    }
}
