import type { Conflict } from '../Conflict.js';
import { AbilityType, EventName } from '../Constants.js';
import { EventRegistrar } from '../EventRegistrar.js';
import type { EventPayload } from '../Events/EventPayloads.js';
import type Game from '../Game.js';
import type { ProvinceCard } from '../ProvinceCard.js';

/** Records which provinces conflicts were declared against this round. */
export class ConflictsDeclaredThisRound {
    private declarations: string[] = [];

    constructor(game: Game) {
        const eventRegistrar = new EventRegistrar(game, this);
        eventRegistrar.register([{
            [EventName.OnConflictDeclared + ':' + AbilityType.Reaction]: 'onConflictDeclaredReaction'
        }]);
        eventRegistrar.register([EventName.OnRoundEnded]);
    }

    public onRoundEnded() {
        this.declarations = [];
    }

    public onConflictDeclaredReaction(event: EventPayload<typeof EventName.OnConflictDeclared>) {
        const declaration = declarationOf(event.conflict);
        if(declaration && !this.declarations.includes(declaration)) {
            this.declarations.push(declaration);
        }
    }

    /** The number of conflicts declared against the province this round. */
    public countAgainst(province: ProvinceCard | undefined): number {
        const provinceId = provinceIdOf(province);
        if(!provinceId) {
            return 0;
        }
        return this.declarations.filter((declaration) => declaration.indexOf(provinceId) >= 0).length;
    }

    /** Whether a conflict other than `conflict` was declared against the province this round. */
    public wasAttackedBefore(province: ProvinceCard, conflict: Conflict | null): boolean {
        const current = declarationOf(conflict ?? undefined);
        const provinceId = provinceIdOf(province);
        if(!provinceId) {
            return false;
        }
        return this.declarations.some((declaration) => declaration.indexOf(provinceId) >= 0 && declaration !== current);
    }
}

function provinceIdOf(province?: ProvinceCard): string | undefined {
    if(!province) {
        return undefined;
    }
    const { uuid, id, location } = province;
    return `${uuid}-${id}-${location}`;
}

function declarationOf(conflict?: Conflict): string | undefined {
    if(!conflict) {
        return undefined;
    }
    const provinceId = provinceIdOf(conflict.declaredProvince ?? undefined);
    if(!provinceId) {
        return undefined;
    }
    return `${provinceId}-${conflict.uuid}`;
}
