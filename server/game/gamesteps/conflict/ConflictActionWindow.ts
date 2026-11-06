import { msg } from '../../GameChat.js';
import type Player from '../../Player.js';
import { ActionWindow } from '../ActionWindow.js';
import type Game from '../../Game.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type { AbilityResolver } from '../AbilityResolver.js';
import type { Conflict } from '../../Conflict.js';
import { RestrictionType, ActionWindowName } from '../../Constants.js';
import { capitalize } from '../../utils/capitalize.js';

export class ConflictActionWindow extends ActionWindow {
    conflict: Conflict;
    displayTotals: boolean;

    constructor(game: Game, title: string, conflict: Conflict) {
        super(game, title, ActionWindowName.Conflict);
        this.conflict = conflict;
        this.displayTotals = true;
    }

    /** "Attacker: 5 (+3 at resolution) Defender: 4". */
    private skillText(): string {
        const bonus = (player: Player | undefined) => {
            const value = this.conflict.resolutionBonus(player);
            return value !== 0 ? ` (${value > 0 ? '+' : ''}${value} at resolution)` : '';
        };
        return `Attacker: ${this.conflict.attackerSkill}${bonus(this.conflict.attackingPlayer)} Defender: ${this.conflict.defenderSkill}${bonus(this.conflict.defendingPlayer)}`;
    }

    private conflictText(): string {
        return capitalize(this.conflict.conflictType ?? '') + ' ' + capitalize(this.conflict.element ?? '') + ' conflict';
    }

    override continue(): boolean {
        const completed = super.continue();
        if(!completed && this.displayTotals) {
            const conflictText = this.conflictText();
            this.game.addMessage(msg`${conflictText} - ${this.skillText()}`);
            let winnerText = 'Attacker is winning the conflict';
            const breakingProvinces: ProvinceCard[] = [];
            // as the conflict would resolve now, so a player sees the province would break
            const { attackerSkill, defenderSkill } = this.conflict.getResolutionSkills();
            const winner = this.conflict.getWinningPlayer(attackerSkill, defenderSkill);
            if(!winner) {
                winnerText = 'No-one is winning the conflict';
            } else if(winner === this.conflict.defendingPlayer) {
                winnerText = 'Defender is winning the conflict';
            } else {
                const provinces = this.conflict.getConflictProvinces();
                provinces.forEach((province: ProvinceCard) => {
                    if(!province.isBroken && province.checkRestrictions(RestrictionType.Break, this.game.getFrameworkContext(this.conflict.attackingPlayer)) && attackerSkill >= defenderSkill + province.getStrength()) {
                        breakingProvinces.push(province);
                    }
                });
                if(breakingProvinces.length === 1) {
                    winnerText = winnerText + ' - {0} is breaking!';
                } else if(breakingProvinces.length > 1) {
                    winnerText = winnerText + ' - {0} are breaking!';
                }
            }
            this.game.addMessage([winnerText, [breakingProvinces]]);
            this.displayTotals = false;
        }
        return completed;
    }

    override activePrompt() {
        const props = super.activePrompt();

        const conflictText = this.conflictText();
        const skillText = this.skillText();
        return {
            menuTitle: [conflictText, skillText].join('\n'),
            buttons: props.buttons,
            promptTitle: this.title
        };
    }

    override postResolutionUpdate(resolver: AbilityResolver): void {
        super.postResolutionUpdate(resolver);
        if(!this.game.manualMode) {
            this.displayTotals = true;
        }
    }
}

