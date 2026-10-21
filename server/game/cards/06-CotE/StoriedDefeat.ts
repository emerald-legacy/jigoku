import { msg } from '../../GameChat.js';
import { CardType } from '../../Constants.js';
import {
    bow,
    dishonor,
    joint,
    loseFate,
    multiple,
    optional
} from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class StoriedDefeat extends DrawCard {
    static id = 'storied-defeat';

    public override setupCardAbilities() {
        const duelLosers = DuelsThisConflict.losers(this.game, { forgetOnEnterPlay: true });
        this.action('Bow a character who lost a duel')
            .condition((context) => context.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => duelLosers.has(card)
            }, multiple([
                bow(),
                optional((context) => ({
                    activePromptTitle: 'Spend 1 fate to dishonor ' + (context.target?.name ?? '') + '?',
                    required: !bow().canAffect(context.target, context),
                    acceptMessage: () => msg`${context.player} chooses to spend a fate to dishonor ${context.target}`,
                    declineMessage: () => msg`${context.player} chooses not to spend a fate to dishonor ${context.target}`,
                    gameAction: joint([
                        loseFate({ target: context.player, spend: true }),
                        dishonor({ target: context.target })
                    ])
                }))
            ]))
            .chatText('bow {0}');
    }
}
