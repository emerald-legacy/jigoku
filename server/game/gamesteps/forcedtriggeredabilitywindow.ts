import { BaseStep } from './BaseStep.js';
import { TriggeredAbilityWindowTitle } from './TriggeredAbilityWindowTitle.js';
import { Locations, AbilityTypes } from '../Constants.js';
import type Game from '../Game.js';
import type { Event } from '../Events/Event.js';
import type EventWindow from '../Events/EventWindow.js';
import type Player from '../Player.js';
import type BaseCard from '../BaseCard.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type TriggeredAbility from '../TriggeredAbility.js';
import type CardAbility from '../CardAbility.js';
import type Ring from '../Ring.js';
import type EffectSource from '../EffectSource.js';
import type AbilityResolver from './abilityresolver.js';

class ForcedTriggeredAbilityWindow extends BaseStep {
    choices: TriggeredAbilityContext[];
    events: Event[];
    eventWindow: EventWindow;
    eventsToExclude: Event[];
    abilityType: AbilityTypes;
    currentPlayer: Player;
    resolvedAbilities: Array<{ ability: TriggeredAbility; event: Event }>;
    complete?: boolean;

    constructor(game: Game, abilityType: AbilityTypes, window: EventWindow, eventsToExclude: Event[] = []) {
        super(game);
        this.choices = [];
        this.events = [];
        this.eventWindow = window;
        this.eventsToExclude = eventsToExclude;
        this.abilityType = abilityType;
        this.currentPlayer = this.game.getFirstPlayer() as Player;
        this.resolvedAbilities = [];
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

    addChoice(context: TriggeredAbilityContext) {
        if(!context.event.cancelled && !this.hasAbilityBeenTriggered(context) && context.ability && !context.ability.isKeywordAbility()) {
            this.choices.push(context);
        }
    }

    filterChoices(): boolean {
        if(this.choices.length === 0) {
            return true;
        }
        if(this.choices.length === 1 || !this.currentPlayer.optionSettings.orderForcedAbilities) {
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

    promptBetweenSources(choices: TriggeredAbilityContext[]) {
        this.game.promptForSelect(this.currentPlayer, Object.assign({}, this.getPromptForSelectProperties(), {
            cardCondition: (card: BaseCard) => choices.some(context => context.source === card),
            onSelect: (_player: Player, card: BaseCard) => {
                this.promptBetweenAbilities(choices.filter(context => context.source === card));
                return true;
            }
        }));
    }

    getPromptForSelectProperties() {
        return Object.assign({ location: Locations.Any }, this.getPromptProperties());
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
        let map = new Map<BaseCard | Ring | EffectSource, BaseCard[]>();
        for(const event of this.events) {
            if(event.context && event.context.source) {
                let targets = map.get(event.context.source) || [];
                if(event.context.target) {
                    targets = targets.concat(event.context.target);
                } else if(event.card && event.card !== event.context.source) {
                    targets = targets.concat(event.card as BaseCard);
                } else if((event.context as TriggeredAbilityContext).event && (event.context as TriggeredAbilityContext).event.card) {
                    targets = targets.concat((event.context as TriggeredAbilityContext).event.card as BaseCard);
                } else if(event.card) {
                    targets = targets.concat(event.card as BaseCard);
                }
                map.set(event.context.source, [...new Set(targets)]);
            }
        }
        return [...map.entries()].map(([source, targets]) => ({
            type: 'targeting',
            source: source.getShortSummary(),
            targets: targets.map((target: BaseCard) => target.getShortSummaryForControls(this.currentPlayer))
        }));
    }

    promptBetweenAbilities(choices: TriggeredAbilityContext[], addBackButton = true) {
        let menuChoices = [...new Set(choices.map(context => (context.ability as CardAbility).title))];
        if(menuChoices.length === 1) {
            // this card has only one ability which can be triggered
            this.promptBetweenEventCards(choices, addBackButton);
            return;
        }
        // This card has multiple abilities which can be used in this window - prompt the player to pick one
        let handlers = menuChoices.map(title => (() => this.promptBetweenEventCards(choices.filter(context => (context.ability as CardAbility).title === title))));
        if(addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        }
        this.game.promptWithHandlerMenu(this.currentPlayer, Object.assign({}, this.getPromptProperties(), {
            activePromptTitle: 'Which ability would you like to use?',
            choices: menuChoices,
            handlers: handlers
        }));
    }

    promptBetweenEventCards(choices: TriggeredAbilityContext[], addBackButton = true) {
        if((choices[0].ability as TriggeredAbility).collectiveTrigger) {
            // This ability only triggers once for all events in this window
            this.resolveAbility(choices[0]);
            return;
        }
        // Check if events only affect a single card
        const uniqueEventCards = new Set(choices.map(context => context.event.card));
        if(uniqueEventCards.size === 1) {
            // The events which this ability can respond to only affect a single card
            this.promptBetweenEvents(choices, addBackButton);
            return;
        }
        // Several cards could be affected by this ability - prompt the player to choose which they want to affect
        this.game.promptForSelect(this.currentPlayer, Object.assign({}, this.getPromptForSelectProperties(), {
            activePromptTitle: 'Select a card to affect',
            cardCondition: (card: BaseCard) => choices.some(context => context.event.card === card),
            buttons: addBackButton ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (_player: Player, card: BaseCard) => {
                this.promptBetweenEvents(choices.filter(context => context.event.card === card));
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

    promptBetweenEvents(choices: TriggeredAbilityContext[], addBackButton = true) {
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
        let menuChoices = choices.map(context => TriggeredAbilityWindowTitle.getAction(context.event));
        let handlers = choices.map(context => (() => this.resolveAbility(context)));
        if(addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        }
        this.game.promptWithHandlerMenu(this.currentPlayer, Object.assign({}, this.getPromptProperties(), {
            activePromptTitle: 'Choose an event to respond to',
            choices: menuChoices,
            handlers: handlers
        }));
    }

    resolveAbility(context: TriggeredAbilityContext) {
        let resolver = this.game.resolveAbility(context);
        this.game.queueSimpleStep(() => {
            if(resolver.passPriority) {
                this.postResolutionUpdate(resolver);
            }
        });
    }

    postResolutionUpdate(resolver: AbilityResolver) {
        const context = resolver.context as TriggeredAbilityContext;
        this.resolvedAbilities.push({ ability: context.ability as TriggeredAbility, event: context.event });
    }

    hasAbilityBeenTriggered(context: TriggeredAbilityContext): boolean {
        return this.resolvedAbilities.some(resolved => resolved.ability === context.ability && ((context.ability as TriggeredAbility).collectiveTrigger || resolved.event === context.event));
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

export default ForcedTriggeredAbilityWindow;
