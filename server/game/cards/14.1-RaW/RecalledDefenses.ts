import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes, Players } from '../../Constants.js';

class RecalledDefenses extends DrawCard {
    static id = 'recalled-defenses';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Move a card to your stronghold',
            target: {
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.type !== CardTypes.Province && card !== context.source,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.StrongholdProvince })
            },
            effect: 'move {1} to their stronghold province',
            effectArgs: context => [context.target ?? '']
        });
    }
}


export default RecalledDefenses;
