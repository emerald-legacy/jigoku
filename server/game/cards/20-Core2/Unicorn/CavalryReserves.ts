import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location, Players, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class CavalryReserves extends DrawCard {
    static id = 'cavalry-reserves';

    setupCardAbilities() {
        this.action('Put Cavalry into play from your discard')
            .condition((context) => context.game.isDuringConflict('military'))
            .targetCards('target', {
                mode: TargetMode.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: (card) => card.getCost() ?? 0,
                maxStat: () => 6,
                numCards: 0,
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry')
            }, AbilityDsl.actions.putIntoConflict());
    }
}
