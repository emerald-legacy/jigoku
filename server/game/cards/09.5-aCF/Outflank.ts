import DrawCard from '../../DrawCard.js';
import { Duration, CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Outflank extends DrawCard {
    static id = 'outflank';

    setupCardAbilities() {
        this.reaction('Prevent a character from declaring as a defender')
            .when({
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            })
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => !card.isUnique()
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()
            }))
            .effect('prevent {0} from declaring as a defender this conflict')
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default Outflank;
