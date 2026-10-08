import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Phase } from '../../Constants.js';

class ShadowedVillage extends DrawCard {
    static id = 'shadowed-village';

    setupCardAbilities() {
        this.reaction('Draw cards')
            .when({
                onMoveFate: (event, context) =>
                    context.game.currentPhase !== Phase.Fate &&
                    event.origin &&
                    event.origin.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    (event.fate ?? 0) > 0
            })
            .draw((context) => ({
                amount: context.event.origin instanceof BaseCard && context.event.origin.isDishonored ? 2 : 1
            }))
            .chatText('draw {1} card{2}', (context) => (context.event.origin instanceof BaseCard && context.event.origin.isDishonored ? ['2', 's'] : ['a', '']));
    }
}


export default ShadowedVillage;
