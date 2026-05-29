import { UiPrompt } from '../UiPrompt.js';
import { Locations, CardTypes } from '../../Constants.js';
import AttackersMatrix from './attackersMatrix.js';
import { AbilityContext } from '../../AbilityContext.js';
import CovertAbility from '../../KeywordAbilities/CovertAbility.js';
import { GameModes } from '../../../GameModes.js';
import type Player from '../../Player.js';

const capitalize: Record<string, string> = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class InitiateConflictPrompt extends UiPrompt {
    conflict: any;
    choosingPlayer: Player;
    attackerChoosesRing: boolean;
    canPass: boolean;
    selectedDefenders: any[];
    covertRemaining: boolean;
    attackerMatrix: AttackersMatrix;

    constructor(game: any, conflict: any, choosingPlayer: Player, attackerChoosesRing = true, canPass = attackerChoosesRing, attackerMatrix: AttackersMatrix | null = null) {
        super(game);
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.attackerChoosesRing = attackerChoosesRing;
        this.canPass = canPass;
        this.selectedDefenders = [];
        this.covertRemaining = false;

        if(attackerMatrix === null) {
            this.attackerMatrix = new AttackersMatrix(this.choosingPlayer, (this.choosingPlayer as any).cardsInPlay, this.game);
            if(!this.attackerMatrix.canPass) {
                this.canPass = false;
            }
        } else {
            this.attackerMatrix = attackerMatrix;
        }

        if(this.conflict.conflictProvince) {
            this.conflict.conflictProvince.inConflict = true;
        }

        this.checkForMustSelect();
    }

    continue(): boolean {
        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    checkForMustSelect(): void {
        if(this.attackerMatrix.forcedNumberOfAttackers > 0) {
            this.conflict.ring = this.attackerMatrix.defaultRing;
            this.conflict.ring.resetRing();
            this.conflict.ring.contested = true;
            if(this.conflict.ring.conflictType !== this.attackerMatrix.defaultType) {
                this.conflict.ring.flipConflictType();
            }
            for(const card of this.attackerMatrix.getForcedAttackers(this.conflict.ring, this.conflict.conflictType, this.conflict.conflictProvince)) {
                if(this.checkCardCondition(card) && !this.conflict.attackers.includes(card)) {
                    this.selectCard(card);
                }
            }
        }
    }

    highlightSelectableRings(): void {
        let selectableRings = Object.values(this.game.rings).filter((ring: any) => {
            return this.checkRingCondition(ring);
        });
        this.choosingPlayer.setSelectableRings(selectableRings);
    }

    activeCondition(player: Player): boolean {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons: any[] = [];
        let menuTitle = '';
        let promptTitle = '';

        if(this.canPass) {
            buttons.push({ text: 'Pass Conflict', arg: 'pass' });
        }

        if(!this.conflict.ring) {
            menuTitle = this.conflict.forcedDeclaredType ? 'Choose an elemental ring' : 'Choose an elemental ring\n(click the ring again to change conflict type)';
            promptTitle = 'Initiate Conflict';
        } else {
            promptTitle = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' Conflict';
            if(!this.conflict.conflictProvince && !this.conflict.isSinglePlayer) {
                menuTitle = 'Choose province to attack';
            } else if(this.conflict.attackers.length === 0) {
                menuTitle = 'Choose attackers';
            } else {
                if(this.covertRemaining && this.game.gameMode !== GameModes.Emerald) {
                    menuTitle = 'Choose defenders to Covert';
                } else {
                    menuTitle = capitalize[this.conflict.conflictType] + ' skill: '.concat(this.conflict.attackerSkill);
                }
                if(this.conflict.attackers.length === this.attackerMatrix.requiredNumberOfAttackers || this.attackerMatrix.requiredNumberOfAttackers <= 0) {
                    buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
                }
            }
        }

        return {
            selectRing: true,
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to declare conflict' };
    }

    onCardClicked(player: Player, card: any): boolean {
        return player === this.choosingPlayer && this.checkCardCondition(card) && this.selectCard(card);
    }

    onRingClicked(player: Player, ring: any): boolean {
        return player === this.choosingPlayer && this.checkRingCondition(ring) && this.selectRing(ring);
    }

    selectRing(ring: any): boolean {
        let player = this.choosingPlayer;

        if(this.conflict.ring === ring) {
            ring.flipConflictType();
        } else {
            const type = ring.conflictType;

            let polValid = this.attackerMatrix.isCombinationValid(ring, 'political', this.conflict.conflictProvince);
            let milValid = this.attackerMatrix.isCombinationValid(ring, 'military', this.conflict.conflictProvince);

            if(!(player as any).hasLegalConflictDeclaration({ type, ring, province: this.conflict.conflictProvince })) {
                ring.flipConflictType();
            } else if(polValid && !milValid && type === 'military') {
                ring.flipConflictType();
            } else if(milValid && !polValid && type === 'political') {
                ring.flipConflictType();
            } else if(this.conflict.attackers.some((card: any) => !card.canDeclareAsAttacker(type, ring))) {
                ring.flipConflictType();
            }
            if(this.conflict.ring) {
                this.conflict.ring.resetRing();
            }
            this.conflict.ring = ring;
            ring.contested = true;
        }

        this.conflict.attackers.forEach((card: any) => {
            if(!card.canDeclareAsAttacker(ring.conflictType, ring)) {
                this.removeFromConflict(card);
            }
        });

        this.attackerMatrix.getForcedAttackers(ring, ring.conflictType, this.conflict.conflictProvince).forEach((card: any) => {
            if(!this.conflict.attackers.includes(card)) {
                this.selectCard(card);
            }
        });

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    checkRingCondition(ring: any): boolean {
        const player = this.choosingPlayer;
        const province = this.conflict.conflictProvince;
        let attackers = this.conflict.attackers;
        this.conflict.attackers = [];
        if(this.conflict.ring === ring) {
            const newType = ring.conflictType === 'military' ? 'political' : 'military';
            if(!(player as any).hasLegalConflictDeclaration({ type: newType, ring, province })) {
                this.conflict.attackers = attackers;
                return false;
            }

            if(!this.attackerMatrix.isCombinationValid(ring, newType, this.conflict.conflictProvince)) {
                this.conflict.attackers = attackers;
                return false;
            }

            this.conflict.attackers = attackers;
            return true;
        }
        let result = this.attackerChoosesRing && (player as any).hasLegalConflictDeclaration({ ring, province }) && (this.attackerMatrix.isCombinationValid(ring, 'political') || this.attackerMatrix.isCombinationValid(ring, 'military'));
        this.conflict.attackers = attackers;
        return result;
    }

    checkCardCondition(card: any): boolean {
        if(card.isProvince && card.controller !== this.choosingPlayer) {
            return card === this.conflict.conflictProvince || (this.choosingPlayer as any).hasLegalConflictDeclaration({
                type: this.conflict.conflictType,
                ring: this.conflict.ring,
                province: card
            });
        } else if(card.type === CardTypes.Character && card.location === Locations.PlayArea) {
            if(card.controller === this.choosingPlayer) {
                if(this.conflict.attackers.includes(card)) {
                    let forced = this.attackerMatrix.getForcedAttackers(this.conflict.ring, this.conflict.conflictType, this.conflict.conflictProvince).includes(card);
                    let extraAttackers = this.attackerMatrix.requiredNumberOfAttackers > 0 ? this.conflict.attackers.length > this.attackerMatrix.requiredNumberOfAttackers : false;
                    let enoughForcedRemaining = true;

                    if(forced && extraAttackers) {
                        let forcedRemainingCount = this.conflict.attackers.filter((a: any) =>
                            this.attackerMatrix.getForcedAttackers(this.conflict.ring, this.conflict.conflictType, this.conflict.conflictProvince).includes(a)).length - 1; //-1 because we're trying to remove a character from the list
                        if(forcedRemainingCount < this.attackerMatrix.requiredNumberOfAttackers) {
                            enoughForcedRemaining = false;
                        }
                    }

                    return !forced || (extraAttackers && enoughForcedRemaining);
                }
                return (this.choosingPlayer as any).hasLegalConflictDeclaration({
                    type: this.conflict.conflictType,
                    ring: this.conflict.ring,
                    province: this.conflict.conflictProvince,
                    attacker: card
                });
            }

            if(this.selectedDefenders.includes(card)) {
                return true;
            }
            if(card.isCovert() || !this.covertRemaining || this.game.gameMode === GameModes.Emerald) {
                return false;
            }

            //Make sure the covert is legal
            let attackersWithCovert = this.conflict.attackers.filter((card: any) => card.isCovert());
            let covertContexts = attackersWithCovert.map((card: any) => new AbilityContext({
                game: this.game,
                player: this.conflict.attackingPlayer,
                source: card,
                ability: new CovertAbility()
            }));

            let targetable = false;

            for(const context of covertContexts) {
                if(context.player.checkRestrictions('initiateKeywords', context)) {
                    if(card.canBeBypassedByCovert(context) && card.checkRestrictions('target', context)) {
                        targetable = true;
                    }
                }
            }

            return this.covertRemaining && targetable;

        }
        return false;
    }

    recalculateCovert(): void {
        let attackersWithCovert = this.conflict.attackers.filter((card: any) => card.isCovert()).length;
        this.covertRemaining = attackersWithCovert > this.selectedDefenders.length;
    }

    selectCard(card: any): boolean {
        if(card.isProvince) {
            if(this.conflict.conflictProvince) {
                this.conflict.conflictProvince.inConflict = false;
                this.conflict.conflictProvince = null;
            } else {
                this.conflict.conflictProvince = card;
                this.conflict.conflictProvince.inConflict = true;
            }
        } else if(card.type === CardTypes.Character) {
            if(card.controller === this.choosingPlayer) {
                if(!this.conflict.attackers.includes(card)) {
                    this.conflict.addAttacker(card);
                } else {
                    this.removeFromConflict(card);
                }
            } else {
                if(!this.selectedDefenders.includes(card)) {
                    this.selectedDefenders.push(card);
                    card.covert = true;
                } else {
                    this.selectedDefenders = this.selectedDefenders.filter((c: any) => c !== card);
                    card.covert = false;
                }
            }
        }

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    removeFromConflict(card: any): void {
        if(card.isCovert() && !this.covertRemaining) {
            this.selectedDefenders.pop().covert = false;
        }
        this.conflict.removeFromConflict(card);
    }

    menuCommand(_player: Player, arg: string): boolean {
        if(arg === 'done') {
            if(!this.conflict.ring || this.game.rings[this.conflict.element] !== this.conflict.ring ||
                                (!this.conflict.isSinglePlayer && !this.conflict.conflictProvince) || this.conflict.attackers.length === 0) {
                return false;
            }
            this.conflict.setDeclarationComplete(true);
            this.complete();
            this.conflict.declaredRing = this.conflict.ring;
            this.conflict.declaredType = this.conflict.ring.conflictType;
            return true;
        } else if(arg === 'pass') {
            this.game.promptWithHandlerMenu(this.choosingPlayer, {
                activePromptTitle: 'Are you sure you want to pass your conflict opportunity?',
                source: 'Pass Conflict',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.complete();
                        this.conflict.passConflict();
                    },
                    () => true
                ]
            });
            return true;
        }
        return false;
    }
}

export default InitiateConflictPrompt;
