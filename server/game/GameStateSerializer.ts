import { Phase } from './Constants.js';
import { AnonymousSpectator } from './AnonymousSpectator.js';
import type Game from './Game.js';
import type { GameState, SharedGameState } from './Game.js';
import type BaseCard from './BaseCard.js';
import type Player from './Player.js';
import type { PlayerState } from './Player.js';
import type { DeckDTO, GameSaveState, GameSummary, PlayerSummary } from '../gamenode/LobbyProtocol.js';
import type { StateViewer } from './types/StateViewer.js';

export interface FormattedDeck {
    faction: unknown;
    conflictCards: string[];
    dynastyCards: string[];
    provinceCards: string[];
    stronghold: string | undefined;
    role: string | undefined;
}

/** Hidden card identities from state `seq` on, until the next entry. */
export interface HiddenInfoChange {
    seq: number;
    info: Record<string, unknown>;
}

export class GameStateSerializer {
    private lastHiddenInfoFingerprint = '';
    private stateSeq = 0;
    /** The replay covers the game up to and including the winning state; states after it aren't numbered. */
    private hiddenInfoClosed = false;

    constructor(private readonly game: Game) {}

    formatDeckForSaving(deck: DeckDTO): FormattedDeck {
        const result: FormattedDeck = {
            faction: {},
            conflictCards: [],
            dynastyCards: [],
            provinceCards: [],
            stronghold: undefined,
            role: undefined
        };

        //faction
        result.faction = deck.faction;

        //conflict
        for(const cardData of deck.conflictCards ?? []) {
            if(cardData.card) {
                result.conflictCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        }

        //dynasty
        for(const cardData of deck.dynastyCards ?? []) {
            if(cardData.card) {
                result.dynastyCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        }

        //provinces
        for(const cardData of deck.provinceCards ?? []) {
            if(cardData.card) {
                result.provinceCards.push(cardData.card.id);
            }
        }

        //stronghold & role
        for(const cardData of deck.stronghold ?? []) {
            if(cardData.card) {
                result.stronghold = cardData.card.id;
            }
        }
        for(const cardData of deck.role ?? []) {
            if(cardData.card) {
                result.role = cardData.card.id;
            }
        }

        return result;
    }

    getSaveState(): GameSaveState {
        const game = this.game;
        const players = game.getPlayers().map((player) => ({
            name: player.name,
            faction: player.faction.name || player.faction.value || '',
            honor: player.getTotalHonor(),
            lostProvinces: player
                .getProvinceCards()
                .reduce((count: number, card) => (card.isBroken ? count + 1 : count), 0),
            deck: this.formatDeckForSaving(player.deck),
            deckId: player.deck._id === undefined || player.deck._id === null ? undefined : String(player.deck._id)
        }));

        return {
            id: game.savedGameId,
            gameId: game.id,
            startedAt: game.startedAt,
            players: players,
            winner: game.winner ? game.winner.name : undefined,
            winReason: game.winReason,
            gameMode: game.gameMode,
            finishedAt: game.finishedAt,
            roundNumber: game.roundNumber,
            initialFirstPlayer: game.initialFirstPlayer
        };
    }

    getSharedState(): SharedGameState | null {
        const game = this.game;
        if(!game.started) {
            return null;
        }

        let conflictState: Record<string, unknown> = {};
        if(game.currentPhase === Phase.Conflict && game.currentConflict) {
            conflictState = game.currentConflict.getSummary();
        }

        return {
            id: game.id,
            manualMode: game.manualMode,
            name: game.name,
            owner: game.owner,
            conflict: conflictState,
            phase: game.currentPhase,
            roundNumber: game.roundNumber,
            spectators: game.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            started: game.started,
            gameMode: game.gameMode,
            winner: game.winner ? game.winner.name : undefined,
            animations: game.pendingAnimations.slice()
        };
    }

    getState(activePlayerName?: string, sharedState?: SharedGameState | null): GameState | GameSummary | undefined {
        const game = this.game;
        const activePlayer: StateViewer = (activePlayerName && game.playersAndSpectators[activePlayerName]) || new AnonymousSpectator();

        if(!game.started) {
            return this.getSummary(activePlayerName);
        }

        const shared = sharedState || this.getSharedState();

        const playerState: Record<string, PlayerState> = {};
        const ringState: Record<string, unknown> = {};

        for(const player of game.getPlayers()) {
            playerState[player.name] = player.getState(activePlayer);
        }

        Object.values(game.rings).forEach((ring) => {
            ringState[ring.element] = ring.getState(activePlayer);
        });

        return Object.assign({}, shared, {
            players: playerState,
            rings: ringState,
            messages: game.gameChat.messages
        });
    }

    /** The piles whose cards the opponent doesn't see, in the replay log's order. */
    private hiddenPiles(player: Player) {
        return {
            hand: player.hand,
            stronghold: player.strongholdProvince,
            one: player.provinceOne,
            two: player.provinceTwo,
            three: player.provinceThree,
            four: player.provinceFour,
            strongholdChildren: player.stronghold?.childCards ?? []
        };
    }

    getHiddenInfoFingerprint(): string {
        const parts: string[] = [];
        for(const player of this.game.getPlayers()) {
            parts.push(player.name);
            for(const pile of Object.values(this.hiddenPiles(player))) {
                parts.push(pile.map((c) => c.uuid).join(','));
            }
        }
        return parts.join('|');
    }

    recordHiddenInfo(): number | undefined {
        if(this.hiddenInfoClosed) {
            return undefined;
        }
        this.hiddenInfoClosed = !!this.game.winner;
        const seq = ++this.stateSeq;
        const log = this.game.hiddenInfoLog;
        const fingerprint = this.getHiddenInfoFingerprint();
        if(fingerprint !== this.lastHiddenInfoFingerprint || log.length === 0) {
            this.lastHiddenInfoFingerprint = fingerprint;
            log.push({ seq, info: this.getHiddenInfo() });
        }
        return seq;
    }

    getHiddenInfo(): Record<string, unknown> {
        const info: Record<string, unknown> = {};
        const cardSummary = (card: BaseCard) => ({
            id: card.cardData.id,
            name: card.cardData.name,
            packId: card.packId,
            type: card.getType(),
            uuid: card.uuid
        });
        for(const player of this.game.getPlayers()) {
            const { hand, stronghold, one, two, three, four, strongholdChildren } = this.hiddenPiles(player);
            info[player.name] = {
                hand: hand.map(cardSummary),
                provinces: {
                    stronghold: stronghold.map(cardSummary),
                    one: one.map(cardSummary),
                    two: two.map(cardSummary),
                    three: three.map(cardSummary),
                    four: four.map(cardSummary)
                },
                strongholdChildren: strongholdChildren.map(cardSummary)
            };
        }
        return info;
    }

    getSummary(activePlayerName?: string): GameSummary | undefined {
        const game = this.game;
        const playerSummaries: Record<string, PlayerSummary> = {};

        for(const player of game.getPlayers()) {
            let deck: { name?: string; selected?: boolean } | undefined;
            if(player.left) {
                return;
            }

            if(activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.value,
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        }

        return {
            allowSpectators: game.allowSpectators,
            createdAt: game.createdAt,
            gameType: game.gameType,
            id: game.id,
            manualMode: game.manualMode,
            messages: game.gameChat.messages,
            name: game.name,
            owner: game.owner,
            players: playerSummaries,
            started: game.started,
            startedAt: game.startedAt,
            gameMode: game.gameMode,
            spectators: game.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            })
        };
    }
}
