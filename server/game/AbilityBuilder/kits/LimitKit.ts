import * as AbilityLimit from '../../AbilityLimit.js';
import type { Period } from '../types.js';

export type Limit = AbilityLimit.AbilityLimit;

export const limitKit = {
    /** "(Limit X per period.)" or "(Max X per period.)" */
    per(period: Period, times: number): Limit {
        switch(period) {
            case 'conflict':
                return AbilityLimit.perConflict(times);
            case 'phase':
                return AbilityLimit.perPhase(times);
            case 'round':
                return AbilityLimit.perRound(times);
            case 'game':
                return AbilityLimit.perGame(times);
        }
    },
    /** "(Unlimited.)" */
    unlimited: (): Limit => AbilityLimit.unlimited(),
    /** Unlimited, but at most once for each triggering condition in a conflict. */
    unlimitedPerConflict: (): Limit => AbilityLimit.unlimitedPerConflict()
};

export type LimitKit = typeof limitKit;

export interface FinishOptions {
    limit?: Limit;
    max?: Limit;
}
