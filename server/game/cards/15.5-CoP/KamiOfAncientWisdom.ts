import DrawCard from '../../drawcard.js';
import { CardTypes, Phases, Players, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KamiOfAncientWisdom extends DrawCard {
    static id = 'kami-of-ancient-wisdom';

    setupCardAbilities() {
        this.reaction({
            title: 'Give or take fate',
            when: {
                onMoveFate: (event, context) => context.game.currentPhase !== Phases.Fate &&
                    event.origin && event.origin.type === CardTypes.Character && event.fate > 0
            },
            targets: {
                character: {
                    controller: Players.Any,
                    cardType: CardTypes.Character
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    choices: {
                        'Place 1 Fate': AbilityDsl.actions.placeFate(context => ({ target: context.targets.character })),
                        'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default KamiOfAncientWisdom;
