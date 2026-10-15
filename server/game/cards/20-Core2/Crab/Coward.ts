import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class Coward extends DrawCard {
    static id = 'coward-';

    public setupCardAbilities() {
        this.duelChallenge('Dishonor a character')
            .selectCard((context) => ({
                activePromptTitle: 'Choose a duel participant',
                cardType: CardType.Character,
                controller: Players.Any,
                hidePromptIfSingleCard: true,
                cardCondition: (card) => {
                    const duel = context.event.duel;
                    if(!card.isDrawCard()) {
                        return false;
                    }
                    const isInvolved = duel.isInvolved(card);
                    const isChallenger = duel.challenger === card;
                    const higherSkill = duel.targets.some(
                        (target) => duel.getSkillStatistic(card) > duel.getSkillStatistic(target)
                    );

                    return isInvolved && isChallenger && higherSkill;
                },
                message: (context, cards) => msg`${context.player} dishonors ${cards}`,
                gameAction: dishonor()
            }))
            .chatText('dishonor a duel challenger');

        this.reaction('Dishonor a character')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, dishonor());
    }
}
