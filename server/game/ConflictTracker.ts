import type Player from './Player.js';
import { ConflictTypes, Players } from './Constants.js';

export interface ConflictRecord {
    attackingPlayer: Player;
    declaredType: ConflictTypes | string;
    passed: boolean;
    uuid: string;
    completed?: boolean;
    winner?: Player;
    typeSwitched?: boolean;
}

export class ConflictTracker {
    records: ConflictRecord[] = [];

    record(conflict: any): void {
        this.records.push({
            attackingPlayer: conflict.attackingPlayer,
            declaredType: conflict.declaredType,
            passed: conflict.conflictPassed,
            uuid: conflict.uuid
        });
        if(conflict.conflictPassed) {
            conflict.attackingPlayer.declaredConflictOpportunities[ConflictTypes.Passed]++;
        } else if(conflict.forcedDeclaredType) {
            conflict.attackingPlayer.declaredConflictOpportunities[ConflictTypes.Forced]++;
        } else {
            conflict.attackingPlayer.declaredConflictOpportunities[conflict.declaredType]++;
        }
    }

    getForPlayer(player: Player | Players.All): ConflictRecord[] {
        if(player === Players.All) {
            return this.records.slice();
        }
        return this.records.filter((r) => r.attackingPlayer === player);
    }

    recordWinner(conflict: any): void {
        const record = this.records.find((r) => r.uuid === conflict.uuid);
        if(record) {
            record.completed = true;
            record.winner = conflict.winner;
            record.typeSwitched = conflict.conflictTypeSwitched;
        }
    }

    reset(): void {
        this.records = [];
    }
}
