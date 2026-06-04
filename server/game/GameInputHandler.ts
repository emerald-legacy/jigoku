import * as MenuCommands from './MenuCommands.js';
import { Phases } from './Constants.js';
import { resolvePackId } from './CardPackUtil.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type BaseCard from './BaseCard.js';

const CHANGEABLE_STATS = new Set([
    'fate',
    'honor',
    'imperialFavor',
    'conflictsRemaining',
    'militaryRemaining',
    'politicalRemaining'
]);

const TOGGLE_WINDOWS = new Set([
    'dynasty', 'draw', 'preConflict', 'conflict', 'fate', 'regroup'
]);

const TOGGLE_TIMER_SETTINGS = new Set([
    'events', 'eventsInDeck'
]);

const TOGGLE_OPTION_SETTINGS = new Set([
    'markCardsUnselectable', 'cancelOwnAbilities', 'orderForcedAbilities',
    'confirmOneClick', 'disableCardStats', 'showStatusInSidebar',
    'sortHandByName', 'showRingEffects', 'hideEffectMarkers'
]);

export class GameInputHandler {
    constructor(private readonly game: Game) {}

    cardClicked(sourcePlayer: string, cardId: string): void {
        const player = this.game.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        const card = this.game.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.game.pipeline.handleCardClicked(player, card);
    }

    facedownCardClicked(
        playerName: string,
        location: string,
        controllerName: string,
        isProvince: boolean = false
    ): void {
        const player = this.game.getPlayerByName(playerName);
        const controller = this.game.getPlayerByName(controllerName);
        if(!player || !controller) {
            return;
        }
        const list = controller.getSourceList(location);
        if(!list) {
            return;
        }
        const card = list.find((card: BaseCard) => !isProvince === !card.isProvince);
        if(card) {
            this.game.pipeline.handleCardClicked(player, card);
            return;
        }
    }

    ringClicked(sourcePlayer: string, ringindex: string): void {
        const ring = this.game.rings[ringindex];
        const player = this.game.getPlayerByName(sourcePlayer);

        if(!player || !ring) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        if(this.game.pipeline.handleRingClicked(player, ring)) {
            return;
        }

        // If it's not the conflict phase and the ring hasn't been claimed, flip it
        if(this.game.currentPhase !== Phases.Conflict && !ring.claimed) {
            ring.flipConflictType();
        }
    }

    menuItemClick(sourcePlayer: string, cardId: string, menuItem: { command: string; text: string; arg: string; method: string }): void {
        const player = this.game.getPlayerByName(sourcePlayer);
        const card = this.game.findAnyCardInAnyList(cardId);
        if(!player || !card) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }

        if(!this.game.manualMode) {
            return;
        }

        MenuCommands.cardMenuClick(menuItem, this.game, player, card);
        this.game.checkGameState(true);
    }

    ringMenuItemClick(sourcePlayer: string, sourceRing: { element: string }, menuItem: { command: string; text: string; arg: string; method: string }): void {
        const player = this.game.getPlayerByName(sourcePlayer);
        const ring = this.game.rings[sourceRing.element];
        if(!player || !ring) {
            return;
        }

        if(menuItem.command === 'click') {
            this.ringClicked(sourcePlayer, ring.element);
            return;
        }
        MenuCommands.ringMenuClick(menuItem, this.game, player, ring);
        this.game.checkGameState(true);
    }

    showConflictDeck(playerName: string): void {
        const player = this.game.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showConflict) {
            player.showConflictDeck();

            this.game.addMessage('{0} is looking at their conflict deck', player);
        } else {
            player.showConflict = false;

            this.game.addMessage('{0} stops looking at their conflict deck', player);
        }
    }

    showDynastyDeck(playerName: string): void {
        const player = this.game.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDynasty) {
            player.showDynastyDeck();

            this.game.addMessage('{0} is looking at their dynasty deck', player);
        } else {
            player.showDynasty = false;

            this.game.addMessage('{0} stops looking at their dynasty deck', player);
        }
    }

    drop(playerName: string, cardId: string, source: string, target: string): void {
        const player = this.game.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        player.drop(cardId, source, target);
    }

    changeStat(playerName: string, stat: string, value: number): void {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return;
        }
        if(typeof stat !== 'string' || !CHANGEABLE_STATS.has(stat)) {
            return;
        }
        if(!Number.isInteger(value) || Math.abs(value) > 1) {
            return;
        }

        const target: any = player;

        target[stat] += value;

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.game.addMessage('{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    chat(playerName: string, message: string): void {
        const player = this.game.playersAndSpectators[playerName];
        const args = message.split(' ');

        if(!player) {
            return;
        }

        if(!this.game.isSpectator(player)) {
            if(this.game.chatCommands.executeCommand(player as Player, args[0], args)) {
                this.game.checkGameState(true);
                return;
            }

            const card = Object.values(this.game.shortCardData).find((c: { name: string; id: string }) => {
                return c.name.toLowerCase() === message.toLowerCase() || c.id.toLowerCase() === message.toLowerCase();
            }) as { id: string; name: string; type: string } | undefined;

            if(card) {
                const packId = resolvePackId(undefined, card, this.game.gameMode);
                const cardFragment = { id: card.id, name: card.name, type: card.type, packId };
                this.game.gameChat.addChatMessage(player as Player, { message: this.game.gameChat.formatMessage('{0}', [cardFragment]) });

                return;
            }
        }

        if(!this.game.isSpectator(player) || !this.game.spectatorSquelch) {
            this.game.gameChat.addChatMessage(player as Player, message);
        }
    }

    concede(playerName: string): void {
        const player = this.game.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.game.addMessage('{0} concedes', player);

        const otherPlayer = this.game.getOtherPlayer(player);

        if(otherPlayer) {
            this.game.recordWinner(otherPlayer, 'concede');
        }
    }

    selectDeck(playerName: string, deck: unknown): void {
        if(this.game.playStarted) {
            return;
        }
        const player = this.game.getPlayerByName(playerName);
        if(player) {
            player.selectDeck(deck);
        }
    }

    shuffleConflictDeck(playerName: string): void {
        const player = this.game.getPlayerByName(playerName);
        if(player) {
            player.shuffleConflictDeck();
        }
    }

    shuffleDynastyDeck(playerName: string): void {
        const player = this.game.getPlayerByName(playerName);
        if(player) {
            player.shuffleDynastyDeck();
        }
    }

    menuButton(playerName: string, arg: string, uuid: string, method: string): boolean {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        return this.game.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    togglePromptedActionWindow(playerName: string, windowName: string, toggle: boolean): void {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return;
        }
        if(!TOGGLE_WINDOWS.has(windowName)) {
            return;
        }

        player.promptedActionWindows[windowName] = !!toggle;
    }

    toggleTimerSetting(playerName: string, settingName: string, toggle: boolean): void {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return;
        }
        if(!TOGGLE_TIMER_SETTINGS.has(settingName)) {
            return;
        }

        player.timerSettings[settingName] = !!toggle;
    }

    toggleOptionSetting(playerName: string, settingName: string, toggle: boolean): void {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return;
        }
        if(!TOGGLE_OPTION_SETTINGS.has(settingName)) {
            return;
        }

        player.optionSettings[settingName] = !!toggle;
    }

    toggleManualMode(playerName: string): void {
        this.game.chatCommands.manual(this.game.getPlayerByName(playerName) as Player);
    }
}
