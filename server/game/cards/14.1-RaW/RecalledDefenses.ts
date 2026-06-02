import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType, Players } from '../../Constants.js';

class RecalledDefenses extends DrawCard {
    static id = 'recalled-defenses';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Move a card to your stronghold',
            target: {
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => card.type !== CardType.Province && card !== context.source,
                gameAction: AbilityDsl.actions.moveCard({ destination: Location.StrongholdProvince })
            },
            effect: 'move {1} to their stronghold province',
            effectArgs: context => [context.target ?? '']
        });
    }
}


export default RecalledDefenses;
