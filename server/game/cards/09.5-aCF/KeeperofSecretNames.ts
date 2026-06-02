import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KeeperOfSecretNames extends DrawCard {
    static id = 'keeper-of-secret-names';

    setupCardAbilities() {
        this.action({
            title: 'Resolve the ability on a province',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.abilities.actions.length > 0 && !card.isBroken,
                gameAction: AbilityDsl.actions.resolveAbility(context => ({
                    target: context.target,
                    ability: context.target.abilities.actions[0],
                    ignoredRequirements: ['province'],
                    choosingPlayerOverride: context.choosingPlayerOverride
                }))
            }
        });
    }
}


export default KeeperOfSecretNames;
