import { CardTypes, Locations } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ShrineOfVengeance extends ProvinceCard {
    static id = 'shrine-of-vengeance';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Blank and reveal a province',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card: ProvinceCard) => card.facedown,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.dishonorProvince(),
                    AbilityDsl.actions.reveal({ chatMessage: true })
                ])
            }
        });
    }
}
