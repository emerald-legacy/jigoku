import { BaseStep } from './BaseStep.js';
import { TriggeredAbilityWindowTitle } from './TriggeredAbilityWindowTitle.js';
import { Location, AbilityType } from '../Constants.js';
import type Game from '../Game.js';
import { Event } from '../Events/Event.js';
import type { EventWindow } from '../Events/EventWindow.js';
import type Player from '../Player.js';
import type BaseCard from '../BaseCard.js';
import type { TriggerChoice } from '../TriggeredAbility.js';
import type { TriggeredAbility } from '../TriggeredAbility.js';
import type Ring from '../Ring.js';
import type { HandlerMenuOption } from './HandlerMenuPrompt.js';
import type { EffectSource } from '../EffectSource.js';

function promptCardFor(context: TriggerChoice): BaseCard | undefined {
    return Event.promptCardOf(context.event);
}

export class ForcedTriggeredAbilityWindow extends BaseStep {
    choices: TriggerChoice[];
    events: Event[];
    eventWindow: EventWindow;
    eventsToExclude: Event[];
    abilityType: AbilityType;
    // unset while a window opens during setup, before the first player is chosen
    currentPlayer: Player | undefined;
    resolvedAbilities: Array<{ ability: TriggeredAbility; event: Event | Event[] }>;
    complete?: boolean;

    constructor(game: Game, abilityType: AbilityType, window: EventWindow, eventsToExclude: Event[] = []) {
        super(game);
        this.choices = [];
        this.events = [];
        this.eventWindow = window;
        this.eventsToExclude = eventsToExclude;
        this.abilityType = abilityType;
        this.currentPlayer = this.game.getFirstPlayer();
        this.resolvedAbilities = [];
    }

    /** Prompting needs a player, and a window only prompts once the first player is chosen. */
    protected requireCurrentPlayer(): Player {
        if(!this.currentPlayer) {
            throw new Error('A triggered ability window cannot prompt before the first player is chosen');
        }
        return this.currentPlayer;
    }

    abort(): void {
        if(this.game.currentAbilityWindow === this) {
            this.game.currentAbilityWindow = null;
        }
    }

    continue() {
        this.game.currentAbilityWindow = this;
        if(this.eventWindow) {
            this.emitEvents();
        }

        if(this.filterChoices()) {
            this.game.currentAbilityWindow = null;
            return true;
        }

        return false;
    }

    addChoice(context: TriggerChoice) {
        if(!(context.event instanceof Event && context.event.cancelled) && !this.hasAbilityBeenTriggered(context) && context.ability && !context.ability.isKeywordAbility()) {
            this.choices.push(context);
        }
    }

    filterChoices(): boolean {
        if(this.choices.length === 0) {
            return true;
        }
        if(this.choices.length === 1 || !this.requireCurrentPlayer().optionSettings.orderForcedAbilities) {
            this.resolveAbility(this.choices[0]);
            return false;
        }
        // Check if all choices share a source
        const uniqueSources = new Set(this.choices.map(context => context.source));
        if(uniqueSources.size === 1) {
            // All choices share a source
            this.promptBetweenAbilities(this.choices, false);
        } else {
            // Choose a card to trigger
            this.promptBetweenSources(this.choices);
        }
        return false;
    }

    promptBetweenSources(choices: TriggerChoice[]) {
        this.game.promptForSelect(this.requireCurrentPlayer(), Object.assign({}, this.getPromptForSelectProperties(), {
            cardCondition: (card: BaseCard) => choices.some(context => context.source === card),
            onSelect: (_player: Player, card: BaseCard) => {
                this.promptBetweenAbilities(choices.filter(context => context.source === card));
                return true;
            }
        }));
    }

    getPromptForSelectProperties() {
        return Object.assign({ location: Location.Any }, this.getPromptProperties());
    }

    getPromptProperties() {
        return {
            source: 'Triggered Abilities',
            controls: this.getPromptControls(),
            activePromptTitle: TriggeredAbilityWindowTitle.getTitle(this.abilityType, this.events),
            waitingPromptTitle: 'Waiting for opponent'
        };
    }

    getPromptControls() {
        const map = new Map<BaseCard | Ring | EffectSource, BaseCard[]>();
        for(const event of this.events) {
            if(event.context && event.context.source) {
                let targets = map.get(event.context.source) || [];
                const eventCard = Event.promptCardOf(event);
                const innerCard = Event.promptCardOf('event' in event.context ? event.context.event : undefined);
                const target = event.context.messageTarget();
                if(target) {
                    targets = targets.concat(target);
                } else if(eventCard && eventCard !== event.context.source) {
                    targets = targets.concat(eventCard);
                } else if(innerCard) {
                    targets = targets.concat(innerCard);
                } else if(eventCard) {
                    targets = targets.concat(eventCard);
                }
                map.set(event.context.source, [...new Set(targets)]);
            }
        }
        return [...map.entries()].map(([source, targets]) => ({
            type: 'targeting',
            source: source.getShortSummary(),
            targets: targets.map((target: BaseCard) => target.getShortSummaryForControls(this.requireCurrentPlayer()))
        }));
    }

    promptBetweenAbilities(choices: TriggerChoice[], addBackButton = true) {
        const menuChoices = [...new Set(choices.map(context => context.ability.title))];
        if(menuChoices.length === 1) {
            // this card has only one ability which can be triggered
            this.promptBetweenEventCards(choices, addBackButton);
            return;
        }
        // This card has multiple abilities which can be used in this window - prompt the player to pick one
        const options: HandlerMenuOption[] = menuChoices.map(title => ({
            text: title,
            handler: () => this.promptBetweenEventCards(choices.filter(context => context.ability.title === title))
        }));
        if(addBackButton) {
            options.push({ text: 'Back', handler: () => this.promptBetweenSources(this.choices) });
        }
        this.game.promptWithHandlerMenu(this.requireCurrentPlayer(), Object.assign({}, this.getPromptProperties(), {
            activePromptTitle: 'Which ability would you like to use?',
            options
        }));
    }

    promptBetweenEventCards(choices: TriggerChoice[], addBackButton = true) {
        if(choices[0].ability.collectiveTrigger) {
            // This ability only triggers once for all events in this window
            this.resolveAbility(choices[0]);
            return;
        }
        // Check if events only affect a single card
        const uniqueEventCards = new Set(choices.map(context => promptCardFor(context)));
        if(uniqueEventCards.size === 1) {
            // The events which this ability can respond to only affect a single card
            this.promptBetweenEvents(choices, addBackButton);
            return;
        }
        // Several cards could be affected by this ability - prompt the player to choose which they want to affect
        this.game.promptForSelect(this.requireCurrentPlayer(), Object.assign({}, this.getPromptForSelectProperties(), {
            activePromptTitle: 'Select a card to affect',
            cardCondition: (card: BaseCard) => choices.some(context => promptCardFor(context) === card),
            buttons: addBackButton ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (_player: Player, card: BaseCard) => {
                this.promptBetweenEvents(choices.filter(context => promptCardFor(context) === card));
                return true;
            },
            onMenuCommand: (_player: Player, arg: string) => {
                if(arg === 'back') {
                    this.promptBetweenSources(this.choices);
                    return true;
                }
                return false;
            }
        }));
    }

    promptBetweenEvents(choices: TriggerChoice[], addBackButton = true) {
        // Get unique choices by event
        const seenEvents = new Set();
        choices = choices.filter(context => {
            if(seenEvents.has(context.event)) {
                return false;
            }
            seenEvents.add(context.event);
            return true;
        });
        if(choices.length === 1) {
            // This card is only being affected by a single event which the chosen ability can respond to
            this.resolveAbility(choices[0]);
            return;
        }
        // Several events affect this card and the chosen ability can respond to more than one of them - prompt player to pick one
        const options: HandlerMenuOption[] = choices.map(context => ({
            text: TriggeredAbilityWindowTitle.getAction(context.event),
            handler: () => this.resolveAbility(context)
        }));
        if(addBackButton) {
            options.push({ text: 'Back', handler: () => this.promptBetweenSources(this.choices) });
        }
        this.game.promptWithHandlerMenu(this.requireCurrentPlayer(), Object.assign({}, this.getPromptProperties(), {
            activePromptTitle: 'Choose an event to respond to',
            options
        }));
    }

    resolveAbility(context: TriggerChoice) {
        const resolver = this.game.resolveAbility(context);
        this.game.queueSimpleStep(() => {
            if(resolver.passPriority) {
                this.postResolutionUpdate(context);
            }
        });
    }

    postResolutionUpdate(context: TriggerChoice) {
        this.resolvedAbilities.push({ ability: context.ability, event: context.event });
    }

    hasAbilityBeenTriggered(context: TriggerChoice): boolean {
        return this.resolvedAbilities.some(resolved => resolved.ability === context.ability && (context.ability.collectiveTrigger || resolved.event === context.event));
    }

    emitEvents() {
        this.choices = [];
        this.events = this.eventWindow.events.filter(e => !this.eventsToExclude.includes(e));
        this.events.forEach(event => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
        this.game.emit('aggregateEvent:' + this.abilityType, this.events, this);
    }
}

