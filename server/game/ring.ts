import EffectSource from './EffectSource';
import { ConflictTypes, EffectNames, Elements } from './Constants';
import type Game from './game';
import type Player from './player';
import type DrawCard from './drawcard';

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
    conflictType: ConflictTypes;
    contested = false;
    element: Elements;
    fate = 0;
    attachments: DrawCard[] = [];
    removedFromGame = false;

    constructor(game: Game, element: Elements, type: ConflictTypes) {
        super(game, element.replace(/\b\w/g, (l) => l.toUpperCase()) + ' Ring');
        this.conflictType = type;
        this.element = element;
    }

    isConsideredClaimed(player: Player | null = null): boolean {
        const check = (p: Player) =>
            this.getEffects(EffectNames.ConsiderRingAsClaimed).some((match: (player: Player) => boolean) => match(p)) ||
            this.claimedBy === p.name;
        if(player) {
            return check(player);
        }
        return this.game.getPlayers().some((p: Player) => check(p));
    }

    isConflictType(type: ConflictTypes): boolean {
        return !this.isUnclaimed() && type === this.conflictType;
    }

    canDeclare(player: Player): boolean {
        return (
            !this.getEffects(EffectNames.CannotDeclareRing).some((match: (player: Player) => boolean) => match(player)) &&
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
        if(this.conflictType === ConflictTypes.Military) {
            this.conflictType = ConflictTypes.Political;
        } else {
            this.conflictType = ConflictTypes.Military;
        }
    }

    getElements(): Elements[] {
        let elements: Elements[] = this.getEffects(EffectNames.AddElement).concat([this.element]);
        if(this.game.isDuringConflict()) {
            if(this.isContested()) {
                elements = elements.concat(
                    ...this.game.currentConflict
                        .getAttackers()
                        .map((card: DrawCard) =>
                            card.attachments.reduce(
                                (array: Elements[], attachment: DrawCard) =>
                                    array.concat(attachment.getEffects(EffectNames.AddElementAsAttacker)),
                                card.getEffects(EffectNames.AddElementAsAttacker)
                            )
                        )
                );
            }
        }
        return [...new Set(elements.flat())];
    }

    hasElement(element: Elements | 'none'): boolean {
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

    getState(activePlayer?: Player): Record<string, any> {
        let selectionState = {};

        if(activePlayer) {
            selectionState = activePlayer.getRingSelectionState(this);
        }

        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            contested: this.contested,
            selected: this.game.currentConflict && this.game.currentConflict.conflictRing === this.element,
            element: this.element,
            fate: this.fate,
            menu: this.getMenu(),
            removedFromGame: this.removedFromGame,
            attachments: this.attachments.length
                ? this.attachments.map((attachment) => attachment.getSummary(activePlayer, false))
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

export = Ring;
