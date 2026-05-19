import DrawCard from '../../drawcard.js';
import { Durations, CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Outflank extends DrawCard {
    static id = 'outflank';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from declaring as a defender',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            },
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.cardCannot('declareAsDefender')
                })
            },
            effect: 'prevent {0} from declaring as a defender this conflict'
        });
    }
}


export default Outflank;
