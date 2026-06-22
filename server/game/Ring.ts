import EffectSource from './EffectSource.js';
import { ConflictType, EffectName, Element } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';

class Ring extends EffectSource {
    menu = [
        { command: 'flip', text: 'Flip' },
        { command: 'claim', text: 'Claim' },
        { command: 'contested', text: 'Switch this ring to contested' },
        { command: 'unclaimed', text: 'Set to unclaimed' },
        { command: 'addfate', text: 'Add 1 fate' },
        { command: 'remfate', text: 'Remove 1 fate' },
        { command: 'takefate', text: 'Take all fate' },
        { command: 'conflict', text: 'Initiate Conflict' }
    ];

    printedType = 'ring';
    claimed = false;
    claimedBy = '';
    conflictType: ConflictType;
    contested = false;
    element: Element;
    fate = 0;
    attachments: DrawCard[] = [];
    removedFromGame = false;

    constructor(game: Game, element: Element, type: ConflictType) {
        super(game, element.replace(/\b\w/g, (l) => l.toUpperCase()) + ' Ring');
        this.conflictType = type;
        this.element = element;
    }

    isConsideredClaimed(player: Player | null = null): boolean {
        const check = (p: Player) =>
            this.getEffects(EffectName.ConsiderRingAsClaimed).some((match: (player: Player) => boolean) => match(p)) ||
            this.claimedBy === p.name;
        if(player) {
            return check(player);
        }
        return this.game.getPlayers().some((p: Player) => check(p));
    }

    isConflictType(type: ConflictType): boolean {
        return !this.isUnclaimed() && type === this.conflictType;
    }

    canDeclare(player: Player): boolean {
        return (
            !this.getEffects(EffectName.CannotDeclareRing).some((match: (player: Player) => boolean) => match(player)) &&
            !this.claimed &&
            !this.removedFromGame
        );
    }

    isUnclaimed(): boolean {
        return !this.contested && !this.claimed && !this.removedFromGame;
    }

    isContested(): boolean {
        return this.contested;
    }

    isClaimed(): boolean {
        return this.claimed;
    }

    isRemovedFromGame(): boolean {
        return this.removedFromGame;
    }

    flipConflictType(): void {
        if(this.conflictType === ConflictType.Military) {
            this.conflictType = ConflictType.Political;
        } else {
            this.conflictType = ConflictType.Military;
        }
    }

    getElements(): Element[] {
        let elements: Element[] = this.getEffects(EffectName.AddElement).concat([this.element]);
        if(this.game.isDuringConflict() && this.game.currentConflict) {
            if(this.isContested()) {
                elements = elements.concat(
                    ...this.game.currentConflict
                        .getAttackers()
                        .map((card: DrawCard) =>
                            card.attachments.reduce(
                                (array: (Element | Element[])[], attachment: DrawCard) =>
                                    array.concat(attachment.getEffects(EffectName.AddElementAsAttacker)),
                                card.getEffects(EffectName.AddElementAsAttacker)
                            ).flat()
                        )
                );
            }
        }
        return [...new Set(elements.flat())];
    }

    hasElement(element: Element | 'none'): boolean {
        if(element === 'none') {
            return false;
        }
        return this.getElements().includes(element);
    }

    getFate(): number {
        return this.fate;
    }

    getMenu(): Array<{ command: string; text: string }> | undefined {
        if(this.menu.length === 0 || !this.game.manualMode) {
            return undefined;
        }

        return [{ command: 'click', text: 'Select Ring' }, ...this.menu];
    }

    /**
     * @param fate - the amount of fate to modify this card's fate total by
     */
    modifyFate(fate: number): void {
        this.fate = Math.max(this.fate + fate, 0);
    }

    removeFate(): void {
        this.fate = 0;
    }

    claimRing(player: Player): void {
        this.claimed = true;
        this.claimedBy = player.name;
        this.game.addAnimation({ type: 'claim', playerName: player.name, element: this.element });
    }

    resetRing(): void {
        this.claimed = false;
        this.claimedBy = '';
        this.contested = false;
    }

    removeRingFromPlay(): void {
        this.removedFromGame = true;
    }

    returnRingToPlay(): void {
        this.removedFromGame = false;
    }

    getState(activePlayer?: Player): Record<string, unknown> {
        let selectionState = {};

        if(activePlayer) {
            selectionState = activePlayer.getRingSelectionState(this);
        }

        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            contested: this.contested,
            selected: !!this.game.currentConflict && this.game.currentConflict.ring?.element === this.element,
            element: this.element,
            fate: this.fate,
            menu: this.getMenu(),
            removedFromGame: this.removedFromGame,
            attachments: this.attachments.length
                ? this.attachments.map((attachment) => attachment.getSummary(activePlayer as Player, false))
                : this.attachments
        };

        return Object.assign(state, selectionState);
    }

    override getShortSummary() {
        return Object.assign(super.getShortSummary(), { element: this.element, conflictType: this.conflictType });
    }

    removeAttachment(card: DrawCard): void {
        this.attachments = this.attachments.filter((attachment) => attachment.uuid !== card.uuid);
    }
}

export default Ring;
