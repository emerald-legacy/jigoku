import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class MasterOfTheSwiftWaves extends DrawCard {
    static id = 'master-of-the-swift-waves';

    setupCardAbilities() {
        this.action({
            title:'Switch 2 characters you control',
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                        AbilityDsl.actions.moveToConflict()
                    ])
                }
            },
            effect: 'switch {1} and {2}',
            effectArgs: context => [context.targets.characterInConflict, context.targets.characterAtHome]
        });
    }
}


export default MasterOfTheSwiftWaves;
