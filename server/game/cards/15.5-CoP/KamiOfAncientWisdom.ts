import DrawCard from '../../DrawCard.js';
import { CardType, Phase, Players } from '../../Constants.js';
import { placeFate, removeFate } from '../../GameActions/GameActions.js';

class KamiOfAncientWisdom extends DrawCard {
    static id = 'kami-of-ancient-wisdom';

    setupCardAbilities() {
        this.reaction('Give or take fate')
            .when({
                onMoveFate: (event, context) => context.game.currentPhase !== Phase.Fate &&
                    event.origin && event.origin.type === CardType.Character && (event.fate ?? 0) > 0
            })
            .target({
                name: 'character',
                controller: Players.Any,
                cardType: CardType.Character
            })
            .select({
                name: 'select',
                dependsOn: 'character'
            }, {
                'Place 1 Fate': placeFate(context => ({ target: context.targets.character })),
                'Remove 1 Fate': removeFate(context => ({ target: context.targets.character }))
            });
    }
}


export default KamiOfAncientWisdom;
