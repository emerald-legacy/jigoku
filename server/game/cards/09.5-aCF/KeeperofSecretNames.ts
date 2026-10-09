import DrawCard from '../../DrawCard.js';
import { CardType, Location, Blocker } from '../../Constants.js';
import { resolveAbility } from '../../GameActions/GameActions.js';

class KeeperOfSecretNames extends DrawCard {
    static id = 'keeper-of-secret-names';

    setupCardAbilities() {
        this.action('Resolve the ability on a province')
            .condition(() => this.game.isDuringConflict())
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.abilities.actions.length > 0 && !card.isBroken
            }, resolveAbility((context) => ({
                ability: context.target.abilities.actions[0],
                ignoredBlockers: [Blocker.WrongProvince],
                choosingPlayerOverride: context.choosingPlayerOverride
            })));
    }
}


export default KeeperOfSecretNames;
