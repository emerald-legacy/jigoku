import { AnonymousSpectator } from './AnonymousSpectator.js';
import type Game from './Game.js';
import type { GameState, SharedGameState } from './Game.js';
import type Player from './Player.js';
import type BaseCard from './BaseCard.js';
import type { PlayerState } from './Player.js';
import type { GameSaveState, GameSummary } from '../gamenode/LobbyProtocol.js';

export class GameStateSerializer {
    private lastHiddenInfoFingerprint = '';

    constructor(private readonly game: Game) {}

    formatDeckForSaving(deck: any): any {
        const result: any = {
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
        deck.conflictCards.forEach((cardData: any) => {
            if(cardData && cardData.card) {
                result.conflictCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        });

        //dynasty
        deck.dynastyCards.forEach((cardData: any) => {
            if(cardData && cardData.card) {
                result.dynastyCards.push(`${cardData.count}x ${cardData.card.id}`);
            }
        });

        //provinces
        if(deck.provinceCards) {
            deck.provinceCards.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.provinceCards.push(cardData.card.id);
                }
            });
        }

        //stronghold & role
        if(deck.stronghold) {
            deck.stronghold.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.stronghold = cardData.card.id;
                }
            });
        }
        if(deck.role) {
            deck.role.forEach((cardData: any) => {
                if(cardData && cardData.card) {
                    result.role = cardData.card.id;
                }
            });
        }

        return result;
    }

    getSaveState(): GameSaveState {
        const game = this.game;
        const players = game.getPlayers().map((player) => ({
            name: player.name,
            faction: player.faction.name || player.faction.value,
            honor: player.getTotalHonor(),
            lostProvinces: player
                .getProvinceCards()
                .reduce((count: number, card: any) => (card && card.isBroken ? count + 1 : count), 0),
            deck: this.formatDeckForSaving(player.deck),
            deckId: player.deck?._id?.toString()
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
        if(game.currentPhase === 'conflict' && game.currentConflict) {
            conflictState = game.currentConflict.getSummary();
        }

        const { blocklist: _blocklist, email: _email, emailHash: _emailHash, promptedActionWindows: _promptedActionWindows, settings: _settings, ...ownerSummary } = game.owner;
        return {
            id: game.id,
            manualMode: game.manualMode,
            name: game.name,
            owner: ownerSummary,
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
        const activePlayer = (activePlayerName && game.playersAndSpectators[activePlayerName]) || new AnonymousSpectator();

        if(!game.started) {
            return this.getSummary(activePlayerName);
        }

        const shared = sharedState || this.getSharedState();

        const playerState: Record<string, PlayerState> = {};
        const ringState: Record<string, unknown> = {};

        for(const player of game.getPlayers()) {
            playerState[player.name] = player.getState(activePlayer as Player);
        }

        Object.values(game.rings).forEach((ring) => {
            ringState[ring.element] = ring.getState(activePlayer as Player);
        });

        return Object.assign({}, shared, {
            players: playerState,
            rings: ringState,
            messages: game.gameChat.messages
        });
    }

    getHiddenInfoFingerprint(): string {
        const parts: string[] = [];
        for(const player of this.game.getPlayers()) {
            parts.push(player.name);
            parts.push(player.hand.map((c: any) => c.uuid).join(','));
            parts.push(player.strongholdProvince.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceOne.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceTwo.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceThree.map((c: any) => c.uuid).join(','));
            parts.push(player.provinceFour.map((c: any) => c.uuid).join(','));
            parts.push(player.stronghold ? player.stronghold.childCards.map((c: any) => c.uuid).join(',') : '');
        }
        return parts.join('|');
    }

    recordHiddenInfoIfChanged(): void {
        const log = this.game.hiddenInfoLog;
        const fingerprint = this.getHiddenInfoFingerprint();
        if(fingerprint === this.lastHiddenInfoFingerprint && log.length > 0) {
            log.push(log[log.length - 1]);
            return;
        }
        this.lastHiddenInfoFingerprint = fingerprint;
        log.push(this.getHiddenInfo());
    }

    getHiddenInfo(): Record<string, unknown> {
        const info: Record<string, unknown> = {};
        for(const player of this.game.getPlayers()) {
            const cardSummary = (card: BaseCard) => ({
                id: card.cardData.id,
                name: card.cardData.name,
                packId: card.packId,
                type: card.getType(),
                uuid: card.uuid
            });
            info[player.name] = {
                hand: player.hand.map(cardSummary),
                provinces: {
                    stronghold: player.strongholdProvince.map(cardSummary),
                    one: player.provinceOne.map(cardSummary),
                    two: player.provinceTwo.map(cardSummary),
                    three: player.provinceThree.map(cardSummary),
                    four: player.provinceFour.map(cardSummary)
                },
                strongholdChildren: player.stronghold ? player.stronghold.childCards.map(cardSummary) : []
            };
        }
        return info;
    }

    getSummary(activePlayerName?: string): GameSummary | undefined {
        const game = this.game;
        const playerSummaries: Record<string, any> = {};

        for(const player of game.getPlayers()) {
            let deck: any = undefined;
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
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        }

        const { blocklist: _blocklist2, email: _email2, emailHash: _emailHash2, promptedActionWindows: _promptedActionWindows2, settings: _settings2, ...ownerSummary } = game.owner;
        return {
            allowSpectators: game.allowSpectators,
            createdAt: game.createdAt,
            gameType: game.gameType,
            id: game.id,
            manualMode: game.manualMode,
            messages: game.gameChat.messages,
            name: game.name,
            owner: ownerSummary,
            players: playerSummaries,
            started: game.started,
            startedAt: game.startedAt,
            gameMode: game.gameMode,
            spectators: game.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            })
        };
    }
}
