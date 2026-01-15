import { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import { EventNames, AbilityTypes, Locations, CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { EventRegistrar } from '../../../EventRegistrar';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class SongOfTheEmptyCity extends DrawCard {
    static id = 'song-of-the-empty-city';

    private eventRegistrar?: EventRegistrar;
    private declaredProvinces = [];

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
            then: context => ({
                thenCondition: () => this.otherHoldingsInSameProvince(context).length > 0,
                gameAction: AbilityDsl.actions.discardCard(() => ({
                    target: this.otherHoldingsInSameProvince(context)
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

    private getHonorGain(context) {
        let currentProvince = context.player.getProvinceCardInProvince(context.source.location);

        if(!this.declaredProvinces) {
            return 1;
        }
        const provinceString = this.getProvinceIdString(currentProvince);
        return this.declaredProvinces.filter(a => a.indexOf(provinceString) >= 0).length;
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
