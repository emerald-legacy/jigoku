import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IronMine extends DrawCard {
    static id = 'iron-mine';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardType.Character && event.card.location === Location.PlayArea
            })
            .gameAction(AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.sacrifice(context => ({ target: context.source }))
            }))
            .effect('prevent {1} from leaving play', context => context.event.card ?? '');
    }
}


export default IronMine;
