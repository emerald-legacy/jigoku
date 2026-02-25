import { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { Conflict } from '../../../conflict';
import { EventNames, TargetModes, AbilityTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { EventRegistrar } from '../../../EventRegistrar';
import { ProvinceCard } from '../../../ProvinceCard';
import Ring from '../../../ring';

export default class VengefulKami extends DrawCard {
    static id = 'vengeful-kami';

    private eventRegistrar?: EventRegistrar;
    private declaredProvinces = [];

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            [EventNames.OnConflictDeclared + ':' + AbilityTypes.Reaction]: 'onConflictDeclaredReaction'
        }]);
        this.eventRegistrar.register([EventNames.OnRoundEnded]);

        this.action({
            title: 'Resolve Ring Effect',
            condition: context => context.game.isDuringConflict() && (context.game.currentConflict as Conflict)
                .getConflictProvinces()
                .some((province: ProvinceCard) => this.wasProvinceAttacked(context.game.currentConflict, province)),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring: Ring, context: AbilityContext) =>
                    ring.isUnclaimed() &&
                    (context.game.currentConflict as Conflict)
                        .getConflictProvinces()
                        .some((province: ProvinceCard) => this.wasProvinceAttacked(context.game.currentConflict, province) && province.getElement().includes(ring.element)),
                gameAction: AbilityDsl.actions.resolveRingEffect()
            },
            effect: 'resolve the {0} effect'
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

    public onConflictDeclaredReaction(event) {
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

    private getConflictString(conflict) {
        if(!conflict) {
            return undefined;
        }

        const provinceString = this.getProvinceIdString(conflict.declaredProvince);
        if(!provinceString) {
            return undefined;
        }
        return `${provinceString}-${conflict.uuid}`;
    }

    private getProvinceIdString(province) {
        if(!province) {
            return undefined;
        }

        const { uuid, id, location } = province;
        return `${uuid}-${id}-${location}`;
    }

    private wasProvinceAttacked(conflict, province) {
        if(!this.declaredProvinces) {
            return false;
        }
        const conflictString = this.getConflictString(conflict);
        const provinceString = this.getProvinceIdString(province);

        for(let i = 0; i < this.declaredProvinces.length; i++) {
            const a = this.declaredProvinces[i];
            if(a.indexOf(provinceString) >= 0 && a !== conflictString) {
                return true;
            }
        }
        return false;
    }
}
