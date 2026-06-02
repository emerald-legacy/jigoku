import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FalseLoyalties extends DrawCard {
    static id = 'false-loyalties';

    setupCardAbilities() {
        this.reaction({
            title:'Switch 2 characters your opponent controls',
            when: {
                afterConflict: (event, context) => {
                    return context.player.opponent && event.conflict.winner === context.player.opponent &&
                    context.player.opponent.isMoreHonorable();
                }
            },
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
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


export default FalseLoyalties;
