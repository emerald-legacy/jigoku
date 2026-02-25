import * as GameActions from './GameActions/GameActions';
import HonorBidPrompt from './gamesteps/honorbidprompt.js';
import { Locations, CardTypes, Players } from './Constants';
import type Game from './game';
import type Player from './player';
import type BaseCard from './basecard';
import type Ring from './ring';

type CommandHandler = (player: Player, args: string[]) => boolean | void;

class ChatCommands {
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
        if(!player || !this.commands[command]) {
            return false;
        }

        return this.commands[command].call(this, player, args) !== false;
    }

    startClocks(player: Player): void {
        this.game.addMessage('{0} restarts the timers', player);
        this.game.getPlayers().forEach((p: Player) => p.clock.manuallyResume());
    }

    stopClocks(player: Player): void {
        this.game.addMessage('{0} stops the timers', player);
        this.game.getPlayers().forEach((p: Player) => p.clock.manuallyPause());
    }

    modifyClock(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 60);
        this.game.addMessage('{0} adds {1} seconds to their clock', player, num);
        player.clock.modify(num);
    }

    random(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 4);
        if(num > 1) {
            this.game.addMessage('{0} rolls a d{1}: {2}', player, num, Math.floor(Math.random() * num) + 1);
        }
    }

    draw(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

        player.drawCardsToHand(num);
    }

    claimFavor(player: Player, args: string[]): void {
        const type = args[1] || 'military';
        this.game.addMessage('{0} uses /claim-favor to claim the emperor\'s {1} favor', player, type);
        player.claimImperialFavor(type);
        const otherPlayer = this.game.getOtherPlayer(player);
        if(otherPlayer) {
            otherPlayer.loseImperialFavor();
        }
    }

    discardFavor(player: Player): void {
        this.game.addMessage('{0} uses /discard-favor to discard the imperial favor', player);
        player.loseImperialFavor();
    }

    honor(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to honor',
            waitingPromptTitle: 'Waiting for opponent to honor',
            cardCondition: (card: BaseCard) =>
                card.location === Locations.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                (card as any).honor();

                this.game.addMessage('{0} uses the /honor command to honor {1}', p, card);
                return true;
            }
        });
    }

    dishonor(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to dishonor',
            waitingPromptTitle: 'Waiting for opponent to dishonor',
            cardCondition: (card: BaseCard) =>
                card.location === Locations.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                (card as any).dishonor();

                this.game.addMessage('{0} uses the /dishonor command to dishonor {1}', p, card);
                return true;
            }
        });
    }

    duel(player: Player): void {
        this.game.addMessage('{0} initiates a duel', player);
        this.game.queueStep(new HonorBidPrompt(this.game, 'Choose your bid for the duel'));
    }

    moveToConflict(player: Player): void {
        if(this.game.currentConflict) {
            this.game.promptForSelect(player, {
                activePromptTitle: 'Select cards to move into the conflict',
                waitingPromptTitle: 'Waiting for opponent to choose cards to move',
                cardCondition: (card: BaseCard) =>
                    card.location === Locations.PlayArea &&
                    card.controller === player &&
                    !(card as any).inConflict,
                cardType: CardTypes.Character,
                numCards: 0,
                multiSelect: true,
                onSelect: (p: Player, cards: BaseCard[]) => {
                    if(p.isAttackingPlayer()) {
                        this.game.currentConflict.addAttackers(cards);
                    } else {
                        this.game.currentConflict.addDefenders(cards);
                    }
                    this.game.addMessage('{0} uses the /move-to-conflict command', p);
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
                    card.location === Locations.PlayArea &&
                    card.controller === player &&
                    (card as any).inConflict,
                cardType: CardTypes.Character,
                onSelect: (p: Player, card: BaseCard) => {
                    this.game.currentConflict.removeFromConflict(card);

                    this.game.addMessage('{0} uses the /send-home command to send {1} home', p, card);
                    return true;
                }
            });
        } else {
            this.game.addMessage('/move-to-conflict can only be used during a conflict');
        }
    }

    discard(player: Player, args: string[]): void {
        const num = this.getNumberOrDefault(args[1], 1);

        this.game.addMessage(
            '{0} uses the /discard command to discard {1} card{2} at random',
            player,
            num,
            num > 1 ? 's' : ''
        );

        GameActions.discardAtRandom({ amount: num }).resolve(player, this.game.getFrameworkContext());
    }

    moveCardToDeckBottom(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to send to the bottom of one of their decks',
            waitingPromptTitle: 'Waiting for opponent to send a card to the bottom of one of their decks',
            location: Locations.Any,
            controller: Players.Self,
            onSelect: (p: Player, card: BaseCard) => {
                const cardInitialLocation = card.location;
                const cardNewLocation = (card as any).isConflict
                    ? Locations.ConflictDeck
                    : Locations.DynastyDeck;
                GameActions.moveCard({ target: card, bottom: true, destination: cardNewLocation }).resolve(
                    player,
                    this.game.getFrameworkContext()
                );
                this.game.addMessage(
                    '{0} uses a command to move {1} from their {2} to the bottom of their {3}.',
                    player,
                    card,
                    cardInitialLocation
                );
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
                (card.location === Locations.PlayArea || (card.location as string) === 'plot') &&
                card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                const numTokens = (card as any).tokens[token] || 0;

                (card as any).addToken(token, num - numTokens);
                this.game.addMessage(
                    '{0} uses the /token command to set the {1} token count of {2} to {3}',
                    p,
                    token,
                    card,
                    num - numTokens
                );

                return true;
            }
        });
    }

    reveal(player: Player): void {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a card to reveal',
            waitingPromptTitle: 'Waiting for opponent to reveal a facedown card',
            location: Locations.Provinces,
            controller: Players.Self,
            cardCondition: (card: BaseCard) => card.isFacedown(),
            onSelect: (p: Player, card: BaseCard) => {
                GameActions.reveal({ target: card }).resolve(p, this.game.getFrameworkContext());
                this.game.addMessage('{0} reveals {1}', p, card);
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
                card.location === Locations.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                (card as any).modifyFate(num);
                this.game.addMessage(
                    '{0} uses the /add-fate command to set the fate count of {1} to {2}',
                    p,
                    card,
                    (card as any).getFate()
                );

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
                card.location === Locations.PlayArea && card.controller === player,
            onSelect: (p: Player, card: BaseCard) => {
                (card as any).modifyFate(-num);
                this.game.addMessage(
                    '{0} uses the /rem-fate command to set the fate count of {1} to {2}',
                    p,
                    card,
                    (card as any).getFate()
                );

                return true;
            }
        });
    }

    addRingFate(player: Player, args: string[]): boolean {
        const ringElement = args[1];
        const num = this.getNumberOrDefault(args[2], 1);

        if(['air', 'earth', 'fire', 'void', 'water'].includes(ringElement)) {
            const ring = this.game.rings[ringElement];

            ring.modifyFate(num);
            this.game.addMessage(
                '{0} uses the /add-fate-ring command to set the fate count of the ring of {1} to {2}',
                player,
                ringElement,
                ring.getFate()
            );
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.modifyFate(num);
                    this.game.addMessage(
                        '{0} uses the /add-fate-ring command to set the fate count of the ring of {1} to {2}',
                        p,
                        ring.element,
                        ring.getFate()
                    );
                    return true;
                }
            });
        }

        return true;
    }

    remRingFate(player: Player, args: string[]): boolean {
        const ringElement = args[1];
        const num = this.getNumberOrDefault(args[2], 1);

        if(['air', 'earth', 'fire', 'void', 'water'].includes(ringElement)) {
            const ring = this.game.rings[ringElement];

            ring.modifyFate(-num);
            this.game.addMessage(
                '{0} uses the /rem-fate-ring command to set the fate count of the ring of {1} to {2}',
                player,
                ringElement,
                ring.getFate()
            );
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.modifyFate(-num);
                    this.game.addMessage(
                        '{0} uses the /rem-fate-ring command to set the fate count of the ring of {1} to {2}',
                        p,
                        ring.element,
                        ring.getFate()
                    );
                    return true;
                }
            });
        }

        return true;
    }

    claimRing(player: Player, args: string[]): boolean {
        const ringElement = args[1];

        if(['air', 'earth', 'fire', 'void', 'water'].includes(ringElement)) {
            const ring = this.game.rings[ringElement];

            ring.claimRing(player);
            this.game.addMessage(
                '{0} uses the /claim-ring command to claim the ring of {1}',
                player,
                ringElement
            );
        } else {
            this.game.promptForRingSelect(player, {
                onSelect: (p: Player, ring: Ring) => {
                    ring.claimRing(p);
                    this.game.addMessage(
                        '{0} uses the /claim-ring command to claim the ring of {1}',
                        p,
                        ring.element
                    );
                    return true;
                }
            });
        }

        return true;
    }

    unclaimRing(player: Player, args: string[]): boolean {
        const ringElement = args[1];

        if(['air', 'earth', 'fire', 'void', 'water'].includes(ringElement)) {
            const ring = this.game.rings[ringElement];

            ring.resetRing();
            this.game.addMessage(
                '{0} uses the /unclaim-ring command to set the ring of {1} as unclaimed',
                player,
                ringElement
            );
        } else {
            this.game.promptForRingSelect(player, {
                ringCondition: (ring: Ring) => ring.claimed,
                onSelect: (p: Player, ring: Ring) => {
                    ring.resetRing();
                    this.game.addMessage(
                        '{0} uses the /unclaim-ring command to set the ring of {1} as unclaimed',
                        p,
                        ring.element
                    );
                    return true;
                }
            });
        }

        return true;
    }

    disconnectMe(player: Player): void {
        player.socket.disconnect();
    }

    manual(player: Player): void {
        if(this.game.manualMode) {
            this.game.manualMode = false;
            this.game.addMessage('{0} switches manual mode off', player);
        } else {
            this.game.manualMode = true;
            this.game.addMessage('{0} switches manual mode on', player);
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

    isValidIcon(icon: string): boolean {
        if(!icon) {
            return false;
        }

        const lowerIcon = icon.toLowerCase();

        return lowerIcon === 'military' || lowerIcon === 'intrigue' || lowerIcon === 'power';
    }

    isValidToken(token: string): boolean {
        if(!token) {
            return false;
        }

        const lowerToken = token.toLowerCase();

        return this.tokens.includes(lowerToken);
    }
}

export = ChatCommands;
