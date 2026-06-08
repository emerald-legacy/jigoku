import ForcedTriggeredAbilityWindow from './ForcedTriggeredAbilityWindow.js';
import { TriggeredAbilityWindowTitle } from './TriggeredAbilityWindowTitle.js';
import { CardType, EventName, AbilityType } from '../Constants.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type EventWindow from '../Events/EventWindow.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type AbilityResolver from './AbilityResolver.js';
import type CardAbility from '../CardAbility.js';

class TriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    complete: boolean;
    prevPlayerPassed: boolean;
    resolvedAbilitiesPerPlayer: Record<string, Array<{ ability: TriggeredAbility; event: Event }>>;

    constructor(game: Game, abilityType: AbilityType, window: EventWindow, eventsToExclude: Event[] = []) {
        super(game, abilityType, window, eventsToExclude);
        this.complete = false;
        this.prevPlayerPassed = false;
        this.resolvedAbilitiesPerPlayer = {};
    }

    showBluffPrompt(player: Player): boolean {
        // Show a bluff prompt if the player has an event which could trigger (but isn't in their hand) and that setting
        if(player.timerSettings.eventsInDeck && this.choices.some(context => context.player === player)) {
            return true;
        }
        // Show a bluff prompt if we're in Step 6, the player has the approriate setting, and there's an event for the other player
        return this.abilityType === AbilityType.WouldInterrupt && !!player.timerSettings.events && this.events.some(event => (
            event.name === EventName.OnInitiateAbilityEffects &&
            (event as GameEvent<EventName.OnInitiateAbilityEffects>).card.type === CardType.Event && event.context && event.context.player !== player
        ));
    }

    promptWithBluffPrompt(player: Player): void {
        this.game.promptWithMenu(player, this, {
            source: 'Triggered Abilities',
            waitingPromptTitle: 'Waiting for opponent',
            activePrompt: {
                promptTitle: TriggeredAbilityWindowTitle.getTitle(this.abilityType, this.events),
                controls: this.getPromptControls(),
                buttons: [
                    { timer: true, method: 'pass' },
                    { text: 'I need more time', timerCancel: true },
                    { text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' },
                    { text: 'Pass', method: 'pass' }
                ]
            }
        });
    }

    pass(player?: Player, arg?: string): boolean {
        if(arg === 'pauseRound' && player) {
            player.noTimer = true;
            player.resetTimerAtEndOfRound = true;
        }
        if(this.prevPlayerPassed || !this.currentPlayer.opponent) {
            this.complete = true;
        } else {
            this.currentPlayer = this.currentPlayer.opponent;
            this.prevPlayerPassed = true;
        }

        return true;
    }

    filterChoices(): boolean {
        // If both players have passed, close the window
        if(this.complete) {
            return true;
        }
        // remove any choices which involve the current player canceling their own abilities
        if(this.abilityType === AbilityType.WouldInterrupt && !this.currentPlayer.optionSettings.cancelOwnAbilities) {
            this.choices = this.choices.filter(context => !(
                context.player === this.currentPlayer &&
                context.event.name === EventName.OnInitiateAbilityEffects &&
                context.event.context?.player === this.currentPlayer
            ));
        }

        // if the current player has no available choices in this window, check to see if they should get a bluff prompt
        if(!this.choices.some(context => context.player === this.currentPlayer && (context.ability as CardAbility).isInValidLocation(context))) {
            if(this.showBluffPrompt(this.currentPlayer)) {
                this.promptWithBluffPrompt(this.currentPlayer);
                return false;
            }
            // Otherwise pass
            this.pass();
            return this.filterChoices();
        }

        // Filter choices for current player, and prompt
        this.choices = this.choices.filter(context => context.player === this.currentPlayer && (context.ability as CardAbility).isInValidLocation(context));
        this.promptBetweenSources(this.choices);
        return false;
    }

    postResolutionUpdate(resolver: AbilityResolver): void {
        super.postResolutionUpdate(resolver);
        if(!this.resolvedAbilitiesPerPlayer[resolver.context.player.uuid]) {
            this.resolvedAbilitiesPerPlayer[resolver.context.player.uuid] = [];
        }
        const context = resolver.context as TriggeredAbilityContext;
        this.resolvedAbilitiesPerPlayer[context.player.uuid].push({ ability: context.ability as TriggeredAbility, event: context.event });

        this.prevPlayerPassed = false;
        this.currentPlayer = this.currentPlayer.opponent || this.currentPlayer;
    }

    getPromptForSelectProperties() {
        return Object.assign({}, super.getPromptForSelectProperties(), {
            selectCard: this.currentPlayer.optionSettings.markCardsUnselectable,
            buttons: [{ text: 'Pass', arg: 'pass' }],
            onMenuCommand: (player: Player, arg: string) => {
                this.pass(player, arg);
                return true;
            }
        });
    }

    hasAbilityBeenTriggered(context: TriggeredAbilityContext): boolean {
        let alreadyResolved = false;
        if(Array.isArray(this.resolvedAbilitiesPerPlayer[context.player.uuid])) {
            alreadyResolved = this.resolvedAbilitiesPerPlayer[context.player.uuid].some(resolved => resolved.ability === context.ability && ((context.ability as TriggeredAbility).collectiveTrigger || resolved.event === context.event));
        }
        return alreadyResolved;
    }
}

export default TriggeredAbilityWindow;
