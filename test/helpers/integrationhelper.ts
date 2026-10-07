/* eslint no-invalid-this: 0 */

import '../../server/game/setupGameActions.js';
import { GameModes } from '../../server/GameModes.js';
import './objectformatters.js';
import DeckBuilder, { fillers } from './deckbuilder.js';
import type { PlayerDeckOptions } from './deckbuilder.js';
import GameFlowWrapper from './gameflowwrapper.js';
import type PlayerInteractionWrapper from './playerinteractionwrapper.js';
import type { CardLike } from './playerinteractionwrapper.js';
import BaseCard from '../../server/game/BaseCard.js';
import Ring from '../../server/game/Ring.js';
import type Game from '../../server/game/Game.js';

const deckBuilder = new DeckBuilder();

const ProxiedGameFlowWrapperMethods = [
    'eachPlayerInFirstPlayerOrder',
    'startGame',
    'keepDynasty',
    'keepConflict',
    'skipSetupPhase',
    'selectFirstPlayer',
    'noMoreActions',
    'selectStrongholdProvinces',
    'advancePhases',
    'getPromptedPlayer',
    'nextPhase',
    'getChatLogs',
    'getChatLog'
] as const;

const customMatchers: jasmine.CustomMatcherFactories = {
    toHavePrompt: function () {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const currentPrompt = actual.currentPrompt();
                const pass = actual.hasPrompt(expected);
                const message = pass
                    ? `Expected ${actual.name} not to have prompt "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                return { pass, message };
            }
        };
    },
    toHavePromptButton: function (util: jasmine.MatchersUtil) {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const buttons = actual.currentPrompt().buttons;
                const pass = buttons.some(
                    (button) => !button.disabled && util.equals(button.text, expected)
                );
                let message: string;
                if(pass) {
                    message = `Expected ${actual.name} not to have enabled prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = buttons.map(
                        (button) => '[' + button.text + (button.disabled ? ' (disabled) ' : '') + ']'
                    ).join('\n');
                    message = `Expected ${actual.name} to have enabled prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
                return { pass, message };
            }
        };
    },
    toHaveDisabledPromptButton: function (util: jasmine.MatchersUtil) {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const buttons = actual.currentPrompt().buttons;
                const pass = buttons.some(
                    (button) => button.disabled && util.equals(button.text, expected)
                );
                let message: string;
                if(pass) {
                    message = `Expected ${actual.name} not to have disabled prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = buttons.map(
                        (button) => '[' + button.text + (button.disabled ? ' (disabled) ' : '') + ']'
                    ).join('\n');
                    message = `Expected ${actual.name} to have disabled prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
                return { pass, message };
            }
        };
    },
    toBeAbleToSelect: function () {
        return {
            compare: function (player: PlayerInteractionWrapper, card: unknown) {
                let resolvedCard = card;
                if(typeof card === 'string') {
                    resolvedCard = player.findCardByName(card);
                }
                const pass = resolvedCard instanceof BaseCard && player.currentActionTargets.includes(resolvedCard);
                const cardName = resolvedCard instanceof BaseCard ? resolvedCard.name : String(resolvedCard);
                const message = pass
                    ? `Expected ${cardName} not to be selectable by ${player.name} but it was.`
                    : `Expected ${cardName} to be selectable by ${player.name} but it wasn't.`;
                return { pass, message };
            }
        };
    },
    toBeAbleToSelectRing: function () {
        return {
            compare: function (player: PlayerInteractionWrapper, ring: unknown) {
                let resolvedRing = ring;
                if(typeof ring === 'string') {
                    resolvedRing = player.player.game.rings[ring];
                }
                const pass = resolvedRing instanceof Ring && player.currentActionRingTargets.includes(resolvedRing);
                const ringElement = resolvedRing instanceof Ring ? resolvedRing.element : String(resolvedRing);
                const message = pass
                    ? `Expected ${ringElement} not to be selectable by ${player.name} but it was.`
                    : `Expected ${ringElement} to be selectable by ${player.name} but it wasn't.`;
                return { pass, message };
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers);
});

interface IntegrationDeckOptions {
    faction?: string;
    role?: string;
    stronghold?: string;
    strongholdProvince?: string;
    provinces?: PlayerDeckOptions['provinces'];
    rings?: string[];
    fate?: number;
    honor?: number;
    inPlay?: PlayerDeckOptions['inPlay'];
    hand?: string[];
    conflictDiscard?: string[];
    dynastyDiscard?: string[];
    [key: string]: unknown;
}

interface IntegrationSetupOptions {
    player1?: IntegrationDeckOptions;
    player2?: IntegrationDeckOptions;
    gameMode?: GameModes;
    phase?: string;
    skipAutoSetup?: boolean;
    skipAutoFirstPlayer?: boolean;
}

interface InitiateConflictOptions {
    type?: string;
    ring?: string;
    province?: CardLike;
    attackers?: CardLike[];
    defenders?: CardLike[];
    jumpTo?: boolean;
}

/** `this` inside an `integration()` spec. */
export type IntegrationContext = Pick<GameFlowWrapper, (typeof ProxiedGameFlowWrapperMethods)[number]> & {
    flow: GameFlowWrapper;
    game: Game;
    player1: PlayerInteractionWrapper;
    player2: PlayerInteractionWrapper;
    setupTest(options?: IntegrationSetupOptions): void;
    initiateConflict(options?: InitiateConflictOptions): void;
};

globalThis.fillers = fillers;

globalThis.integration = function (definitions: () => void): void {
    describe('integration', function (this: unknown) {
        beforeEach(function (this: Record<string, unknown>) {
            const flow = new GameFlowWrapper();
            this.flow = flow;
            this.game = flow.game;
            this.player1Object = flow.game.getPlayerByName('player1');
            this.player2Object = flow.game.getPlayerByName('player2');
            this.player1 = flow.player1;
            this.player2 = flow.player2;

            ProxiedGameFlowWrapperMethods.forEach((method) => {
                this[method] = (...args: unknown[]): unknown => Reflect.apply(flow[method], flow, args);
            });

            this.buildDeck = function (faction: string, cards: string[]): unknown {
                return deckBuilder.buildDeck(faction, cards);
            };

            this.setupTest = function (this: Record<string, unknown>, options: IntegrationSetupOptions = {}) {
                if(!options.player1) {
                    options.player1 = {};
                }
                if(!options.player2) {
                    options.player2 = {};
                }
                const gameMode = options.gameMode || GameModes.Stronghold;
                flow.game.gameMode = gameMode;

                flow.player1.selectDeck(deckBuilder.customDeck(options.player1, gameMode));
                flow.player2.selectDeck(deckBuilder.customDeck(options.player2, gameMode));

                flow.startGame();

                if(!options.skipAutoSetup) {
                    if(!options.skipAutoFirstPlayer) {
                        flow.selectFirstPlayer(flow.player1);
                    }

                    flow.selectStrongholdProvinces({
                        player1: options.player1.strongholdProvince,
                        player2: options.player2.strongholdProvince
                    });
                }

                if(flow.game.gameMode === GameModes.Skirmish) {
                    flow.player1.setupSkirmishProvinces();
                    flow.player2.setupSkirmishProvinces();
                }

                if(options.phase !== 'setup') {
                    if(options.phase && ['draw', 'fate'].includes(options.phase)) {
                        flow.player1.player.promptedActionWindows[options.phase] = true;
                        flow.player2.player.promptedActionWindows[options.phase] = true;
                    }
                    flow.keepDynasty();
                    flow.player1.dynastyDiscard = options.player1.dynastyDiscard;
                    flow.player2.dynastyDiscard = options.player2.dynastyDiscard;

                    flow.keepConflict();

                    flow.advancePhases(options.phase);
                } else {
                    flow.player1.dynastyDiscard = options.player1.dynastyDiscard;
                    flow.player2.dynastyDiscard = options.player2.dynastyDiscard;
                }

                if(options.player1.rings) {
                    options.player1.rings.forEach((ring: string) => flow.player1.claimRing(ring));
                }
                if(options.player2.rings) {
                    options.player2.rings.forEach((ring: string) => flow.player2.claimRing(ring));
                }
                flow.player1.fate = options.player1.fate;
                flow.player2.fate = options.player2.fate;
                flow.player1.honor = options.player1.honor;
                flow.player2.honor = options.player2.honor;
                flow.player1.inPlay = options.player1.inPlay ?? [];
                flow.player2.inPlay = options.player2.inPlay ?? [];
                flow.player1.hand = options.player1.hand ?? [];
                flow.player2.hand = options.player2.hand ?? [];
                flow.player1.conflictDiscard = options.player1.conflictDiscard ?? [];
                flow.player2.conflictDiscard = options.player2.conflictDiscard ?? [];
                if(!options.skipAutoSetup) {
                    flow.player1.provinces = options.player1.provinces;
                    flow.player2.provinces = options.player2.provinces;
                }
                if(options.phase !== 'setup') {
                    for(const location of ['province 1', 'province 2', 'province 3', 'province 4']) {
                        for(const wrapper of [flow.player1, flow.player2]) {
                            // A province emptied by the setup above (an `inPlay` card can be the
                            // only copy and get sourced out of a province) is backfilled facedown.
                            // The dynasty-phase reveal has already happened, so reveal whatever the
                            // backfill just added, and only that. Leaving it facedown would make the
                            // province state depend on the deck shuffle.
                            const before = wrapper.player.getDynastyCardsInProvince(location);
                            wrapper.player.replaceDynastyCard(location);
                            wrapper.player.getDynastyCardsInProvince(location)
                                .filter((card) => !before.includes(card))
                                .forEach((card) => (card.facedown = false));
                        }
                    }
                }
                if(options.phase !== 'setup') {
                    flow.game.checkGameState(true);
                }
            };

            this.initiateConflict = function (this: Record<string, unknown>, options: InitiateConflictOptions = {}) {
                if(!options.type) {
                    options.type = 'military';
                }
                if(!options.ring) {
                    options.ring = 'air';
                }
                const attackingPlayer = flow.getPromptedPlayer(
                    'Choose an elemental ring\n(click the ring again to change conflict type)'
                );
                if(!attackingPlayer) {
                    throw new Error('Neither player can declare a conflict');
                }
                attackingPlayer.declareConflict(
                    options.type,
                    options.province,
                    options.attackers,
                    options.ring
                );
                if(!options.defenders) {
                    return;
                }
                const defendingPlayer = flow.getPromptedPlayer('Choose defenders');
                defendingPlayer.assignDefenders(options.defenders);
                if(!options.jumpTo) {
                    return;
                }
                flow.noMoreActions();
            };
        });

        definitions();
    });
};
