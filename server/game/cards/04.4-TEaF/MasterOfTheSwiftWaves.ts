import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class MasterOfTheSwiftWaves extends DrawCard {
    static id = 'master-of-the-swift-waves';

    setupCardAbilities() {
        this.action('Switch 2 characters you control')
            .target('characterInConflict', {
                activePromptTitle: 'Choose a participating character to send home',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating()
            })
            .target('characterAtHome', {
                dependsOn: 'characterInConflict',
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.joint([
                AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                AbilityDsl.actions.moveToConflict()
            ]))
            .effect('switch {1} and {2}', context => [context.targets.characterInConflict, context.targets.characterAtHome]);
    }
}


export default MasterOfTheSwiftWaves;
