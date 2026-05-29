import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../basecard.js';
import type { Conflict } from '../../../conflict.js';
import { EventNames, AbilityTypes, Locations, CardTypes, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';


export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    private eventRegistrar?: EventRegistrar;
    private declaredProvinces: string[] = [];

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([{
            [EventNames.OnConflictDeclared + ':' + AbilityTypes.Reaction]: 'onConflictDeclaredReaction'
        }]);
        this.eventRegistrar.register([EventNames.OnRoundEnded]);

        this.action({
            title: 'Move holding to another province',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.location !== context.source.location && card.location !== Locations.StrongholdProvince
            },
            gameAction: AbilityDsl.actions.moveCard((context) => ({
                target: context.source,
                destination: context.target.location
            })),
            then: (context: AbilityContext) => ({
                thenCondition: () => !!context && this.otherHoldingsInSameProvince(context as AbilityContext<this>).length > 0,
                gameAction: AbilityDsl.actions.discardCard(() => ({
                    target: context ? this.otherHoldingsInSameProvince(context as AbilityContext<this>) : []
                })),
                message: '{1} discards the other holdings in the province'
            })
        });

        this.reaction({
            title: 'Gain honor',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.player.getProvinceCardInProvince(context.source.location)
            },
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player,
                amount: this.getHonorGain(context)
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
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

    private getHonorGain(context: AbilityContext) {
        let currentProvince = context.player.getProvinceCardInProvince(context.source.location);

        if(!this.declaredProvinces) {
            return 1;
        }
        const provinceString = this.getProvinceIdString(currentProvince as ProvinceCard | undefined);
        if(!provinceString) {
            return 0;
        }
        return this.declaredProvinces.filter((a: string) => a.indexOf(provinceString) >= 0).length;
    }

    private otherHoldingsInSameProvince(context: AbilityContext<this>): BaseCard[] {
        return (context.game.allCards as BaseCard[]).filter(
            (card) =>
                card.location === context.source.location &&
                card.controller === context.source.controller &&
                card.type === CardTypes.Holding &&
                !card.facedown &&
                card !== context.source
        );
    }
}
