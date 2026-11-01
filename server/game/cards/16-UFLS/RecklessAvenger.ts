import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { Players, CardType } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class RecklessAvenger extends DrawCard {
    static id = 'reckless-avenger';

    override setupCardAbilities() {
        this.action('Ready and honor characters')
            .condition((context) => context.player.cardsInPlay.some((a) => a.bowed) && !!context.player.opponent || !!context.player.opponent?.cardsInPlay.some((a) => a.bowed))
            .target({
                name: 'firstCharacter',
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                controller: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent,
                player: (context) => context.player.firstPlayer ? Players.Self : Players.Opponent
            }, ready())
            .target({
                name: 'secondCharacter',
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                optional: true,
                dependsOn: 'firstCharacter',
                controller: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self,
                player: (context) => context.player.firstPlayer ? Players.Opponent : Players.Self
            })
            .if((context) => this.isTargetValid(context.targets.firstCharacter))
            .honor()
            .otherwise()
            .ready()
            .chatText((context) => {
                const { firstCharacter, secondCharacter } = context.targets;
                if(!this.isTargetValid(firstCharacter)) {
                    return msg`ready ${secondCharacter}`;
                }
                return this.isTargetValid(secondCharacter)
                    ? msg`ready ${firstCharacter} and honor ${secondCharacter}`
                    : msg`ready ${firstCharacter}`;
            });
    }

    isTargetValid(target: BaseCard | BaseCard[] | undefined) {
        return !!target && !Array.isArray(target);
    }
}


export default RecklessAvenger;


