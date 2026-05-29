import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Conflict } from '../../../Conflict.js';
import { EventNames, TargetModes, AbilityTypes } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import Ring from '../../../Ring.js';

export default class VengefulKami extends DrawCard {
    static id = 'vengeful-kami';

    private eventRegistrar?: EventRegistrar;
    private declaredProvinces: string[] = [];

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            [EventNames.OnConflictDeclared + ':' + AbilityTypes.Reaction]: 'onConflictDeclaredReaction'
        }]);
        this.eventRegistrar.register([EventNames.OnRoundEnded]);

        this.action({
            title: 'Resolve Ring Effect',
            condition: context => context.game.isDuringConflict() &&
                context.player.isDefendingPlayer() &&
                (context.game.currentConflict as Conflict)
                    .getConflictProvinces()
                    .some((province: ProvinceCard) => this.wasProvinceAttacked(context.game.currentConflict, province)),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context?: AbilityContext) =>
                    !!context && (context.game.currentConflict as Conflict)
                        .getConflictProvinces()
                        .some((province: ProvinceCard) => this.wasProvinceAttacked(context.game.currentConflict, province) && province.getElement().includes(ring.element)),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            },
            effect: 'resolve the {0} effect',
            max: AbilityDsl.limit.perConflict(1)
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });
    }

    public onRoundEnded() {
        this.declaredProvinces = [];
    }

    public onConflictDeclaredReaction(event: EventPayload<typeof EventNames.OnConflictDeclared>) {
        if(!this.declaredProvinces) {
            this.declaredProvinces = [];
        }
        const conflictString = this.getConflictString(event?.conflict);

        if(conflictString) {
            if(!this.declaredProvinces.includes(conflictString)) {
                this.declaredProvinces.push(conflictString);
            }
        }
    }

    private getConflictString(conflict?: Conflict): string | undefined {
        if(!conflict) {
            return undefined;
        }

        const provinceString = this.getProvinceIdString(conflict.declaredProvince ?? undefined);
        if(!provinceString) {
            return undefined;
        }
        return `${provinceString}-${conflict.uuid}`;
    }

    private getProvinceIdString(province?: ProvinceCard): string | undefined {
        if(!province) {
            return undefined;
        }

        const { uuid, id, location } = province;
        return `${uuid}-${id}-${location}`;
    }

    private wasProvinceAttacked(conflict: Conflict | null, province: ProvinceCard) {
        if(!this.declaredProvinces) {
            return false;
        }
        const conflictString = this.getConflictString(conflict ?? undefined);
        const provinceString = this.getProvinceIdString(province);
        if(!provinceString) {
            return false;
        }

        for(let i = 0; i < this.declaredProvinces.length; i++) {
            const a = this.declaredProvinces[i];
            if(a.indexOf(provinceString) >= 0 && a !== conflictString) {
                return true;
            }
        }
        return false;
    }
}
