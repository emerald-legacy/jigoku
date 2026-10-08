import { msg } from './GameChat.js';
import { rollDie } from './utils/random.js';
import * as GameActions from './GameActions/GameActions.js';
import { HonorBidPrompt } from './gamesteps/HonorBidPrompt.js';
import { Location, CardType, Players, TargetMode } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type BaseCard from './BaseCard.js';
import type Ring from './Ring.js';

type CommandHandler = (player: Player, args: string[]) => boolean | void;

export class ChatCommands {
    game: Game;
    commands: Record<string, CommandHandler>;
    tokens: string[];

    constructor(game: Game) {
        this.game = game;
        this.commands = {
            '/draw': this.draw,
            '/honor': this.honor,
            '/dishonor': this.dishonor,
            '/discard': this.discard,
            '/token': this.setToken,
            '/reveal': this.reveal,
            '/duel': this.duel,
            '/move-to-conflict': this.moveToConflict,
            '/move-to-bottom-deck': this.moveCardToDeckBottom,
            '/send-home': this.sendHome,
            '/claim-favor': this.claimFavor,
            '/discard-favor': this.discardFavor,
            '/add-fate': this.addFate,
            '/rem-fate': this.remFate,
            '/add-fate-ring': this.addRingFate,
            '/rem-fate-ring': this.remRingFate,
            '/claim-ring': this.claimRing,
            '/unclaim-ring': this.unclaimRing,
            '/stop-clocks': this.stopClocks,
            '/start-clocks': this.startClocks,
            '/modify-clock': this.modifyClock,
            '/roll': this.random,
            '/disconnectme': this.disconnectMe,
            '/manual': this.manual
        };
        this.tokens = ['fate'];
    }

    executeCommand(player: Player, command: string, args: string[]): boolean {
        if(!player || !Object.prototype.hasOwnProperty.call(this.commands, command)) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    startClocks(player: Player): void {
        this.game.addMessage(msg`${player} restarts the timers`);
        this.game.getPlayers().forEach((p: Player) => p.clock.manuallyResume());
    }

    stopClocks(player: Player): void {
        this.game.addMessage(msg`${player} stops the timers`);
        this.game.getPlayers().forEach((p: Player) => p.clock.manuallyPause());
    }

    modifyClock(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 60);
        this.game.addMessage(msg`${player} adds ${num} seconds to their clock`);
        player.clock.modify(num);
    }

    random(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 4);
        if(num > 1) {
            this.game.addMessage(msg`${player} rolls a d${num}: ${rollDie(num)}`);
        }
    }

    draw(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage(msg`${player} uses the /draw command to draw ${num} cards to their hand`);

        player.drawCardsToHand(num);
    }

    claimFavor(player: Player, args: string[]): void {
        const type = args[1] || 'military';
        this.game.addMessage(msg`${player} uses /claim-favor to claim the emperor's ${type} favor`);
        player.claimImperialFavor(type);
        const otherPlayer = player.opponent;
        if(otherPlayer) {
            otherPlayer.loseImperialFavor();
        }
    }

    discardFavor(player: Player): void {
        this.game.addMessage(msg`${player} uses /discard-favor to discard the imperial favor`);
        player.loseImperialFavor();
    }

    honor(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to honor',
            waitingPromptTitle: 'Waiting for opponent to honor',
            cardCondition: (card: BaseCard) =>
                card.location === Location.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                card.honor();

                this.game.addMessage(msg`${p} uses the /honor command to honor ${card}`);
                return true;
            }
        });
    }

    dishonor(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to dishonor',
            waitingPromptTitle: 'Waiting for opponent to dishonor',
            cardCondition: (card: BaseCard) =>
                card.location === Location.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                card.dishonor();

                this.game.addMessage(msg`${p} uses the /dishonor command to dishonor ${card}`);
                return true;
            }
        });
    }

    duel(player: Player): void {
        this.game.addMessage(msg`${player} initiates a duel`);
        this.game.queueStep(new HonorBidPrompt(this.game, 'Choose your bid for the duel'));
    }

    moveToConflict(player: Player): void {
        if(this.game.currentConflict) {
            this.game.promptForSelect(player, {
                activePromptTitle: 'Select cards to move into the conflict',
                waitingPromptTitle: 'Waiting for opponent to choose cards to move',
                cardCondition: (card: BaseCard) =>
                    card.location === Location.PlayArea &&
                    card.controller === player &&
                    !card.inConflict,
                cardType: CardType.Character,
                mode: TargetMode.Unlimited,
                onSelect: (p: Player, cards) => {
                    if(!this.game.currentConflict) {
                        return true;
                    }
                    const characters = cards.filter((card) => card.isDrawCard());
                    if(p.isAttackingPlayer()) {
                        this.game.currentConflict.addAttackers(characters);
                    } else {
                        this.game.currentConflict.addDefenders(characters);
                    }
                    this.game.addMessage(msg`${p} uses the /move-to-conflict command`);
                    return true;
                }
            });
        } else {
            this.game.addMessage('/move-to-conflict can only be used during a conflict');
        }
    }

    sendHome(player: Player): void {
        if(this.game.currentConflict) {
            this.game.promptForSelect(player, {
                activePromptTitle: 'Select a card to send home',
                waitingPromptTitle: 'Waiting for opponent to send home',
                cardCondition: (card: BaseCard) =>
                    card.location === Location.PlayArea &&
                    card.controller === player &&
                    card.inConflict,
                cardType: CardType.Character,
                onSelect: (p: Player, card: BaseCard) => {
                    if(!this.game.currentConflict || !card.isDrawCard()) {
                        return true;
                    }
                    this.game.currentConflict.removeFromConflict(card);

                    this.game.addMessage(msg`${p} uses the /send-home command to send ${card} home`);
                    return true;
                }
            });
        } else {
            this.game.addMessage('/move-to-conflict can only be used during a conflict');
        }
    }

    discard(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage(msg`${player} uses the /discard command to discard ${num} card${num > 1 ? 's' : ''} at random`);

        GameActions.discardAtRandom({ amount: num }).resolve(player, this.game.getFrameworkContext(player));
    }

    moveCardToDeckBottom(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to send to the bottom of one of their decks',
            waitingPromptTitle: 'Waiting for opponent to send a card to the bottom of one of their decks',
            location: Location.Any,
            controller: Players.Self,
            onSelect: (_p: Player, card: BaseCard) => {
                const cardInitialLocation = card.location;
                const cardNewLocation = card.isConflict
                    ? Location.ConflictDeck
                    : Location.DynastyDeck;
                GameActions.moveCard({ target: card, bottom: true, destination: cardNewLocation }).resolve(
                    player,
                    this.game.getFrameworkContext(player)
                );
                this.game.addMessage(msg`${player} uses a command to move ${card} from their ${cardInitialLocation} to the bottom of their ${cardNewLocation}.`);
                return true;
            }
        });
    }

    setToken(player: Player, args: string[]): boolean | void {
        const token = args[1];
        const num = this.getNumberOrDefault(args[2], 1);

        if(!this.isValidToken(token)) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set token',
            cardCondition: (card: BaseCard) =>
                card.location === Location.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                const numTokens = card.tokens[token] || 0;

                card.addToken(token, num - numTokens);
                this.game.addMessage(msg`${p} uses the /token command to set the ${token} token count of ${card} to ${num - numTokens}`);

                return true;
            }
        });
    }

    reveal(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to reveal',
            waitingPromptTitle: 'Waiting for opponent to reveal a facedown card',
            location: Location.Provinces,
            controller: Players.Self,
            cardCondition: (card: BaseCard) => card.isFacedown(),
            onSelect: (p: Player, card: BaseCard) => {
                GameActions.reveal({ target: card }).resolve(p, this.game.getFrameworkContext(p));
                this.game.addMessage(msg`${p} reveals ${card}`);
                return true;
            }
        });
    }

    addFate(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set fate',
            cardCondition: (card: BaseCard) =>
                card.location === Location.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                if(!card.isDrawCard()) {
                    return true;
                }
                card.modifyFate(num);
                this.game.addMessage(msg`${p} uses the /add-fate command to set the fate count of ${card} to ${card.getFate()}`);

                return true;
            }
        });
    }

    remFate(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card',
            waitingPromptTitle: 'Waiting for opponent to set fate',
            cardCondition: (card: BaseCard) =>
                card.location === Location.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                if(!card.isDrawCard()) {
                    return true;
                }
                card.modifyFate(-num);
                this.game.addMessage(msg`${p} uses the /rem-fate command to set the fate count of ${card} to ${card.getFate()}`);

                return true;
            }
        });
    }

    addRingFate(player: Player, args: string[]): boolean {
        const ringElement = args[1];
        const num = this.getNumberOrDefault(args[2], 1);

        const ring = this.game.ringFor(ringElement);
        if(ring) {

            ring.modifyFate(num);
            this.game.addMessage(msg`${player} uses the /add-fate-ring command to set the fate count of the ring of ${ringElement} to ${ring.getFate()}`);
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.modifyFate(num);
                    this.game.addMessage(msg`${p} uses the /add-fate-ring command to set the fate count of the ring of ${ring.element} to ${ring.getFate()}`);
                    return true;
                }
            });
        }

        return true;
    }

    remRingFate(player: Player, args: string[]): boolean {
        const ringElement = args[1];
        const num = this.getNumberOrDefault(args[2], 1);

        const ring = this.game.ringFor(ringElement);
        if(ring) {

            ring.modifyFate(-num);
            this.game.addMessage(msg`${player} uses the /rem-fate-ring command to set the fate count of the ring of ${ringElement} to ${ring.getFate()}`);
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.modifyFate(-num);
                    this.game.addMessage(msg`${p} uses the /rem-fate-ring command to set the fate count of the ring of ${ring.element} to ${ring.getFate()}`);
                    return true;
                }
            });
        }

        return true;
    }

    claimRing(player: Player, args: string[]): boolean {
        const ringElement = args[1];

        const ring = this.game.ringFor(ringElement);
        if(ring) {

            ring.claimRing(player);
            this.game.addMessage(msg`${player} uses the /claim-ring command to claim the ring of ${ringElement}`);
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.claimRing(p);
                    this.game.addMessage(msg`${p} uses the /claim-ring command to claim the ring of ${ring.element}`);
                    return true;
                }
            });
        }

        return true;
    }

    unclaimRing(player: Player, args: string[]): boolean {
        const ringElement = args[1];

        const ring = this.game.ringFor(ringElement);
        if(ring) {

            ring.resetRing();
            this.game.addMessage(msg`${player} uses the /unclaim-ring command to set the ring of ${ringElement} as unclaimed`);
        } else {
            this.game.promptForRingSelect(player, {
                ringCondition: (ring: Ring) => ring.claimed,
                onSelect: (p: Player, ring: Ring) => {
                    ring.resetRing();
                    this.game.addMessage(msg`${p} uses the /unclaim-ring command to set the ring of ${ring.element} as unclaimed`);
                    return true;
                }
            });
        }

        return true;
    }

    disconnectMe(player: Player): void {
        player.socket?.disconnect();
    }

    /** Spectators reach this through the client's manual mode toggle, without a player. */
    manual(player: Player | undefined): void {
        if(this.game.manualMode) {
            this.game.manualMode = false;
            this.game.addMessage(msg`${player} switches manual mode off`);
        } else {
            this.game.manualMode = true;
            this.game.addMessage(msg`${player} switches manual mode on`);
        }
    }

    getNumberOrDefault(string: string, defaultNumber: number): number {
        let num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    isValidToken(token: string): boolean {
        if(!token) {
            return false;
        }

        const lowerToken = token.toLowerCase();

        return this.tokens.includes(lowerToken);
    }
}

