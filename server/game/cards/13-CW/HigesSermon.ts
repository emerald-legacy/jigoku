import DrawCard from '../../drawcard.js';
import { Phases, Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HigesSermon extends DrawCard {
    static id = 'hige-s-sermon';

    setupCardAbilities() {
        this.action({
            title: 'Bow characters',
            phase: Phases.Draw,
            condition: context => context.player.cardsInPlay.some(a => !a.bowed) && context.player.opponent && context.player.opponent.cardsInPlay.some(a => !a.bowed),
            targets: {
                firstCharacter: {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                    player: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                    gameAction: AbilityDsl.actions.bow()
                },
                secondCharacter: {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                    player: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                    gameAction: AbilityDsl.actions.bow()
                }
            },
            effect: 'bow {1} and {2}',
            effectArgs: context => [context.targets.firstCharacter, context.targets.secondCharacter]
        });
    }
}


export default HigesSermon;


