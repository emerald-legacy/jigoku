import { msg } from '../../GameChat.js';
import { CardAbility } from '../../CardAbility.js';
import { CardType, EventName } from '../../Constants.js';
import {
    bow,
    dishonor,
    joint,
    loseFate,
    optional,
    resolveAbility,
    sequential
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
            }, sequential([
                bow(),
                optional((context) => ({
                    activePromptTitle: 'Spend 1 fate to dishonor ' + context.target.name + '?',
                    required: !context.events.some((event) => event.name === EventName.OnCardBowed),
                    acceptMessage: () => msg`${context.player} chooses to spend a fate to dishonor ${context.target}`,
                    declineMessage: () => msg`${context.player} chooses not to spend a fate to dishonor ${context.target}`,
                    gameAction: joint([
                        loseFate({ target: context.player }),
                        resolveAbility({
                            target: context.source,
                            subResolution: true,
                            ability: new CardAbility(context.source, {
                                title: 'Dishonor this character',
                                gameAction: dishonor({ target: context.target })
                            })
                        })
                    ])
                }))
            ]));
    }
}
