import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DiplomaticGiftGiver extends DrawCard {
    static id = 'diplomatic-gift-giver';

    setupCardAbilities() {
        this.action('Put fate on characters')
            .condition(context => !!(context.source.isParticipating() && context.player.opponent && AbilityDsl.actions.loseFate().canAffect(context.player.opponent, context) && AbilityDsl.actions.loseFate().canAffect(context.player, context)))
            .target('firstCharacter', {
                activePromptTitle: 'Choose a character to receive the gift of fate',
                cardType: CardType.Character,
                controller: context => context.player.firstPlayer ? Players.Opponent : Players.Self,
                player: context => context.player.firstPlayer ? Players.Self : Players.Opponent
            }, AbilityDsl.actions.placeFate(context => ({
                origin: context.player.firstPlayer ? context.player : context.player.opponent
            })))
            .target('secondCharacter', {
                activePromptTitle: 'Choose a character to receive the gift of fate',
                cardType: CardType.Character,
                controller: context => context.player.firstPlayer ? Players.Self : Players.Opponent,
                player: context => context.player.firstPlayer ? Players.Opponent : Players.Self
            }, AbilityDsl.actions.placeFate(context => ({
                origin: context.player.firstPlayer ? context.player.opponent : context.player
            })))
            .effect('gift a fate onto {1} and {2}', context => [context.targets.firstCharacter, context.targets.secondCharacter]);
    }
}


export default DiplomaticGiftGiver;
