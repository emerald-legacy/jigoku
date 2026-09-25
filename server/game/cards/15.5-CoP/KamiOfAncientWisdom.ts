import DrawCard from '../../DrawCard.js';
import { CardType, Phases, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KamiOfAncientWisdom extends DrawCard {
    static id = 'kami-of-ancient-wisdom';

    setupCardAbilities() {
        this.reaction('Give or take fate')
            .when({
                onMoveFate: (event, context) => context.game.currentPhase !== Phases.Fate &&
                    event.origin && event.origin.type === CardType.Character && event.fate > 0
            })
            .target('character', {
                controller: Players.Any,
                cardType: CardType.Character
            })
            .select('select', {
                dependsOn: 'character'
            }, {
                'Place 1 Fate': AbilityDsl.actions.placeFate(context => ({ target: context.targets.character })),
                'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
            });
    }
}


export default KamiOfAncientWisdom;
