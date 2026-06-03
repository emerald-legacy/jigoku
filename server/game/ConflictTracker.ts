import type Player from './Player.js';
import type { Conflict } from './Conflict.js';
import { ConflictType, Players } from './Constants.js';

export interface ConflictRecord {
    attackingPlayer: Player;
    declaredType: ConflictType | null;
    passed: boolean;
    uuid: string;
    completed?: boolean;
    winner?: Player;
    typeSwitched?: boolean;
}

export class ConflictTracker {
    records: ConflictRecord[] = [];

    record(conflict: Conflict): void {
        this.records.push({
            attackingPlayer: conflict.attackingPlayer,
            declaredType: conflict.declaredType,
            passed: conflict.conflictPassed,
            uuid: conflict.uuid
        });
        if(conflict.conflictPassed) {
            conflict.attackingPlayer.declaredConflictOpportunities[ConflictType.Passed]++;
        } else if(conflict.forcedDeclaredType) {
            conflict.attackingPlayer.declaredConflictOpportunities[ConflictType.Forced]++;
        } else {
            conflict.attackingPlayer.declaredConflictOpportunities[conflict.declaredType as ConflictType]++;
        }
    }

    getForPlayer(player: Player | Players.All): ConflictRecord[] {
        if(player === Players.All) {
            return this.records.slice();
        }
        return this.records.filter((r) => r.attackingPlayer === player);
    }

    recordWinner(conflict: Conflict): void {
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
