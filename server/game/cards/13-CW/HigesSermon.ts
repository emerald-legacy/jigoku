import DrawCard from '../../DrawCard.js';
import { Phases, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HigesSermon extends DrawCard {
    static id = 'hige-s-sermon';

    setupCardAbilities() {
        this.action('Bow characters')
            .condition(context => context.player.cardsInPlay.some(a => !a.bowed) && context.player.opponent !== undefined && context.player.opponent.cardsInPlay.some(a => !a.bowed))
            .target('firstCharacter', {
                activePromptTitle: 'Choose a character to bow',
                cardType: CardType.Character,
                controller: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                player: context => context.player.firstPlayer ? Players.Self : Players.Opponent
            }, AbilityDsl.actions.bow())
            .target('secondCharacter', {
                activePromptTitle: 'Choose a character to bow',
                cardType: CardType.Character,
                controller: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                player: context => context.player.firstPlayer ? Players.Opponent : Players.Self
            }, AbilityDsl.actions.bow())
            .effect('bow {1} and {2}', context => [context.targets.firstCharacter, context.targets.secondCharacter])
            .phase(Phases.Draw);
    }
}


export default HigesSermon;


